
import TodoApp from './TodoApp';
import { MURVProvider } from '@murv/provider';
import {Button} from "@murv/button"

const App = () => {
    return (
        <div>

            <MURVProvider themeVariant='light'>
                <TodoApp />
                
            </MURVProvider>
   
        </div>  
    );
};

export default App;
