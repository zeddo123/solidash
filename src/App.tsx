import { useEffect } from "react";
import "./App.css";
import { artifacts, experiment, experiments, metrics } from "./api/Mlsolid";

function App() {
  useEffect(() => {
    const fetchExps = async () => {
      const resp = await experiments();
      const resp2 = await experiment("exp1");
      const resp3 = await metrics("exp2");
      const resp4 = await artifacts("exp1");

      console.log(resp);
      console.log(resp2);
      console.log(resp3);
      console.log(resp4);
    };

    fetchExps();
  }, []);

  return <></>;
}

export default App;
