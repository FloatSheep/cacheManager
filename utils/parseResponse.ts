export async function parseResponse(response: Response): Promise<any> {
  const contentType = response.headers.get("Content-Type");
  let configType: string;

  switch (contentType) {
    case "application/json":
      configType = "json";
      break;
    case "application/octet-stream":
      configType = "arrayBuffer";
      break;
    case "text/number":
      configType = "number";
      break;
    case "text/boolean":
      configType = "boolean";
      break;
    default:
      configType = "text";
      break;
  }

  switch (configType) {
    case "number":
      return Number(await response.text());
    case "json":
      return response.json();
    case "arrayBuffer":
      return response.arrayBuffer();
    case "blob":
      return response.blob();
    case "text":
      return response.text();
    case "boolean":
      return (await response.text()) === "1";
    default:
      return response.body;
  }
}
