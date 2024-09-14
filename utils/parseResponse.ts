type ThePromise<T> = Promise<T | any>;

export async function parseResponse<T>(response: Response): ThePromise<T> {
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
      return Number(await response.text()) as T;
    case "json":
      return response.json() as Promise<T>;
    case "arrayBuffer":
      return response.arrayBuffer() as Promise<T>;
    case "blob":
      return response.blob() as Promise<T>;
    case "text":
      return response.text() as Promise<T>;
    case "boolean":
      return (await response.text()) === "1" as T;
    default:
      return response.body as T;
  }
}
