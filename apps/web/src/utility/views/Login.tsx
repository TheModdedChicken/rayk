import { createSignal, type Component, Switch, Match } from 'solid-js';

import styles from './Login.module.css';
import FeatherIcon, { FeatherIcons } from '../elements/FeatherIcon';
import { A } from '@solidjs/router';
import { Show } from 'solid-js/web';
import { SetEIDHeader, trpc } from '../trpc';
import { useSessionProvider } from '../providers/SessionProvider';

const LoginView: Component = () => {
  const { setSession } = useSessionProvider();

  const [ screen, setScreen ] = createSignal<'info' | 'verify'>('info');
  const [ infoMessage, setInfoMessage ] = createSignal<string | false>(false);

  const [ email, setEmail ] = createSignal<string>('');

  return (
    <div class={styles.login_container}>
      <FeatherIcon icon={FeatherIcons.key} options={{ width: 95, height: 95, "stroke-width": 1.5 }}/>
      <Switch>
        <Match when={screen() === 'info'}>

          <form class={styles.login_form} onSubmit={async (e) => { 
            e.preventDefault();
            setEmail((document.getElementById('login_email') as HTMLInputElement).value);
            setInfoMessage('Contacting sever...');

            const data = await trpc.auth.eid.query({ email: email(), level: 2 });
            if (!data.isUser) {
              setInfoMessage('User does not exist');
              return false;
            }
            if ('error' in data) {
              setInfoMessage((data.error as { message: string }).message);
              return false;
            }

            setInfoMessage(false);
            setScreen('verify');
          }}>
            <input type='email' required={true} name='email' id="login_email" placeholder='Email'/>
            <Show when={infoMessage()}>
              <p>{infoMessage()}</p>
            </Show>
            <button>Login</button>
          </form>
          <A href='/signup'>Switch to Signup</A>

        </Match>

        <Match when={screen() === 'verify'}>
          <p>Verification code sent to <b>{email()}</b></p>
          <form class={styles.login_form} onSubmit={async (e) => { 
            e.preventDefault(); 
            const eidCode = (document.getElementById('login_code') as HTMLInputElement).value;
            setInfoMessage('Contacting sever...');

            SetEIDHeader(email(), eidCode);
            const loginData = await trpc.auth.login.mutate();
            
            setSession(loginData.token);
            setInfoMessage('Successfully logged in! Redirecting...');
          }}>
            <input type='text' required={true} name='code' id="login_code" placeholder='Code'/>
            <Show when={infoMessage()}>
              <p>{infoMessage()}</p>
            </Show>
            <button>Verify</button>
          </form>
        </Match>
      </Switch>
    </div>
  );
};

export default LoginView;
