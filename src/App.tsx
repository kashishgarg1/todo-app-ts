import React from 'react';
import TodoApp from './TodoApp';
import { MURVProvider } from '@murv/provider';

const App: React.FC = () => {
    return (
        <div>
           
            <MURVProvider tenant="Flipkart" themeVariant="light"><TodoApp /></MURVProvider>
        </div>
    );
};

export default App;
