import { createSignal, type Component, Switch, Match } from 'solid-js';

import styles from './Signup.module.css';
import FeatherIcon, { FeatherIcons } from '../elements/FeatherIcon';
import { A } from '@solidjs/router';
import { Portal, Show } from 'solid-js/web';
import { SetEIDHeader, trpc } from '../trpc';
import { UsernameRegex } from 'api/src/utility/regex';
import { useSessionProvider } from '../providers/SessionProvider';

const SignupView: Component = () => {
  const { setSession } = useSessionProvider();

  const [ screen, setScreen ] = createSignal<'info' | 'verify'>('info');
  const [ infoMessage, setInfoMessage ] = createSignal<string | false>(false);

  const [ email, setEmail ] = createSignal<string>('');
  const [ username, setUsername ] = createSignal<string>('');
  const [ accessKey, setAccessKey ] = createSignal<string>('');

  return (
    <div class={styles.signup_container}>
      <FeatherIcon icon={FeatherIcons['user-plus']} options={{ width: 95, height: 95, "stroke-width": 1.5 }}/>
      <Switch>
        <Match when={screen() === 'info'}>

          <form class={styles.signup_form} onSubmit={async (e) => { 
            e.preventDefault();
            setEmail((document.getElementById('signup_email') as HTMLInputElement).value);
            setUsername((document.getElementById('signup_username') as HTMLInputElement).value);
            setAccessKey((document.getElementById('signup_key') as HTMLInputElement).value); 
            setInfoMessage('Contacting sever...');

            const keyData = await trpc.auth.accessKey.query({ key: accessKey() });
            if (!keyData.valid) {
              setInfoMessage('Invalid access key');
              return false;
            }

            const data = await trpc.auth.eid.query({ email: email(), level: 2 });
            if (data.isUser) {
              setInfoMessage('Email is taken');
              return false;
            }
            if ('error' in data) {
              setInfoMessage((data.error as { message: string }).message);
              return false;
            }

            setInfoMessage(false);
            setScreen('verify');
          }}>
            <input type='email' required={true} name='email' id="signup_email" placeholder='Email'/>
            <input type='username' required={true} name='username' id="signup_username" placeholder='Username' pattern={UsernameRegex.source} autocomplete='off'/>
            <input type='text' required={true} name='key' id="signup_key" placeholder='Access Key' autocomplete='off'/>
            <Show when={infoMessage()}>
              <p>{infoMessage()}</p>
            </Show>
            <button>Signup</button>
          </form>
          <A href='/login'>Switch to Login</A>

        </Match>

        <Match when={screen() === 'verify'}>
          <p>Verification code sent to <b>{email()}</b></p>
          <form class={styles.signup_form} onSubmit={async (e) => { 
            e.preventDefault(); 
            const eidCode = (document.getElementById('signup_code') as HTMLInputElement).value;
            setInfoMessage('Contacting sever...');

            SetEIDHeader(email(), eidCode);
            const signupData = await trpc.auth.signup.mutate({ username: username(), key: accessKey() });
            
            setSession(signupData.token);
            setInfoMessage('Successfully signed up! Redirecting...');
          }}>
            <input type='text' required={true} name='code' id="signup_code" placeholder='Code'/>
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

export default SignupView;
