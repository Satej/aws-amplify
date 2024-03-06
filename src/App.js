import React, { useEffect, useState }  from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { createTodo, updateTodo, deleteTodo } from './graphql/mutations';
import { generateClient } from 'aws-amplify/api';
import { listTodos, getTodo, } from './graphql/queries';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

const client = generateClient();

async function storeTodo() {
  await client.graphql({
    query: createTodo,
    variables: {
      input: {
        name: 'wash windows',
      },
    },
  });
}

async function removeTodo() {
  await client.graphql({
    query: deleteTodo,
    variables: {
      input: {
        id: '1',
      },
    },
  });
}

async function changeTodo() {
  await client.graphql({
    query: updateTodo,
    variables: {
      input: {
        id: '1',
        name: 'wash car',
      },
    },
  });
}

const App = () => {
  
  const [ todos, setTodos ] = useState([]);

  async function fetchTodos() {
    const todos = await client.graphql({ query: listTodos });
    setTodos(todos.data.listTodos.items);
  }

  async function fetchTodo() {
    const todo = await client.graphql({ query: getTodo, variables: { id: '1' } });
    console.log(todo);
  }
  
  useEffect(() => {  
    fetchTodos();
  }, [setTodos]);

  return (
    <Authenticator>
      {({ user, signOut }) => (
        <main>
          <h1>Welcome {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
          <ul>
            {todos.map(todo => (
              <li key={todo.id}>{todo.name}</li>
            ))}
          </ul>
          <button onClick={storeTodo}>New Todo</button>
        </main>
      )}
    </Authenticator>
  );
};

export default App;