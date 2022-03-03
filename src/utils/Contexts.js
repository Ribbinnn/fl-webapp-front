import React from "react";
const Contexts = React.createContext({
  project: { globalProject: {}, setGlobalProject: () => {} },
  active: { currentActivity: {}, setCurrentAvtivity: () => {} },
});
export default Contexts;
