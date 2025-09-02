import { readFileSync } from "fs";

interface TaskData {
  name: string;
  desc?: string;
  due: string;
  assignee: string;
}

export async function createTrelloTasksFromFile(
  tasksFile: string,
  apiKey: string,
  token: string,
  listId: string
) {
  // Read tasks file
  const fileContent = readFileSync(tasksFile, "utf-8");
  const tasks: TaskData[] = JSON.parse(fileContent);

  const results = [];

  for (const task of tasks) {
    try {
      const card = await createCard({
        key: apiKey,
        token,
        idList: listId,
        name: task.name,
        desc: task.desc || "",
        due: task.due,
        assignee: task.assignee,
      });

      results.push({
        name: task.name,
        status: "created",
        id: (card as any).id,
      });
    } catch (error) {
      results.push({
        name: task.name,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return {
    totalTasks: tasks.length,
    results,
  };
}

async function createCard({
  key,
  token,
  idList,
  name,
  desc,
  due,
  assignee,
}: {
  key: string;
  token: string;
  idList: string;
  name: string;
  desc: string;
  due?: string;
  assignee?: string;
}) {
  const params = new URLSearchParams({
    key,
    token,
    idList,
    name,
    desc,
  });

  if (due) params.append("due", due);
  if (assignee) params.append("idMembers", assignee);

  const response = await fetch(
    `https://api.trello.com/1/cards?${params.toString()}`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create card: ${response.status} - ${errorText}`);
  }

  return await response.json();
}
