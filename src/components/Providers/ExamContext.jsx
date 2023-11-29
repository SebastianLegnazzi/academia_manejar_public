import React, { createContext, useState } from 'react';

const ExamContext = createContext({});

const ExamProvider = ({ children }) => {
    const [param, setParam] = useState(null)

    return (
        <ExamContext.Provider value={{ 
            param,
            setParam,
         }}>
            {children}
        </ExamContext.Provider>
    );
};

export { ExamProvider, ExamContext }