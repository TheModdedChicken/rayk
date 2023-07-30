import type { Component } from 'solid-js';

import styles from './App.module.css';
import LoginView from './utility/views/Login';
import { Routes, Route, Navigate } from '@solidjs/router';
import MainView from './utility/views/Home';
import SignupView from './utility/views/Signup';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <Routes>
        <Route path='/home' component={MainView} />
        <Route path='/login' component={LoginView} />
        <Route path='/signup' component={SignupView} />
        <Route path='/' element={<Navigate href='/home'/>} />
      </Routes>
    </div>
  );
};

export default App;
