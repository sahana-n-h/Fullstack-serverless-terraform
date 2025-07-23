const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

const TASKS_TABLE = process.env.TASKS_TABLE || "tasks";

// Standard CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
};

exports.handler = async (event) => {
  const method = event.requestContext.http.method;
  const path = event.requestContext.http.path;
  const pathParts = path.split("/").filter(Boolean);

  // Handle CORS preflight
  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({}),
    };
  }

  // GET /tasks (list all tasks)
  if (method === "GET" && path.endsWith("/tasks")) {
    const data = await dynamo.scan({ TableName: TASKS_TABLE }).promise();
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(data.Items || []),
    };
  }

  // POST /tasks (add a new task)
  if (method === "POST" && path.endsWith("/tasks")) {
    const body = JSON.parse(event.body);
    if (!body.title || !body.description) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing 'title' or 'description'." }),
      };
    }
    const task = {
      taskId: `${Date.now()}`,
      title: body.title.trim(),
      description: body.description.trim(),
    };
    await dynamo.put({ TableName: TASKS_TABLE, Item: task }).promise();
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(task),
    };
  }

  // PUT /tasks/{taskId} (update task)
  if (method === "PUT" && pathParts.length === 2 && pathParts[0] === "tasks") {
    const taskId = pathParts[1];
    const body = JSON.parse(event.body);
    if (!body.title || !body.description) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing 'title' or 'description'." }),
      };
    }
    const params = {
      TableName: TASKS_TABLE,
      Key: { taskId },
      UpdateExpression: "set #t = :title, #d = :description",
      ExpressionAttributeNames: { "#t": "title", "#d": "description" },
      ExpressionAttributeValues: { ":title": body.title, ":description": body.description },
      ReturnValues: "ALL_NEW",
    };
    const result = await dynamo.update(params).promise();
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Attributes),
    };
  }

  // DELETE /tasks/{taskId}
  if (method === "DELETE" && pathParts.length === 2 && pathParts[0] === "tasks") {
    const taskId = pathParts[1];
    await dynamo.delete({ TableName: TASKS_TABLE, Key: { taskId } }).promise();
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "",
    };
  }

  // If nothing matches, return 405
  return {
    statusCode: 405,
    headers: corsHeaders,
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
};
