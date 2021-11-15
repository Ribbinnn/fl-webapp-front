import React from "react";
const Contexts = {
  project: React.createContext({
    globalProject: {},
    setGlobalProject: () => {},
  }),
};

export default Contexts;
