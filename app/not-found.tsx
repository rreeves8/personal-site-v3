import { Error } from "@/components/next/error";

export default function Custom404() {
  return <Error statusCode={404} />;
}
