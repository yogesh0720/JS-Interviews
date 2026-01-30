//npm install datadog-lambda-js dd-trace
const { datadog } = require("datadog-lambda-js");

const handler = async (event) => {
  console.log("Processing event");
  return { statusCode: 200, body: "Success" };
};

exports.handler = datadog(handler);
