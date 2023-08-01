import type { Component } from 'solid-js';

import styles from './App.module.css';
import LoginView from './utility/views/Login';
import { Routes, Route, Navigate } from '@solidjs/router';
import MainView from './utility/layouts/Main';
import SignupView from './utility/views/Signup';
import HomeView from './utility/views/Home';
import SensitiveRoute from './utility/components/SensitiveRoute';
import BubbleView from './utility/views/Bubbles';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <Routes>
        <Route path='/login' component={LoginView} />
        <Route path='/signup' component={SignupView} />
        <Route path='/' component={MainView}>
          <SensitiveRoute path='/home' component={HomeView} />
          <SensitiveRoute path='/bubbles' component={BubbleView} />
        </Route>
        <Route path='/**' element={<h3>Page Not Found.</h3>} />
      </Routes>
    </div>
  );
};

export default App;
