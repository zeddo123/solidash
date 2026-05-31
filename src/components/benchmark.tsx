import { useParams } from "react-router";

export default function Benchmark() {
  const { id } = useParams();

  return <div>Benchmark {id}</div>;
}
