import { createResource, type Component, Switch, Match, createSignal, createEffect, Show } from 'solid-js';

import styles from './Main.module.css';
import FeatherIcon, { FeatherIcons } from '../components/FeatherIcon';

import ContextMenu, { ContextOption } from '../components/ContextMenu';
import { A, Outlet, useNavigate } from '@solidjs/router';
import { trpc } from '../trpc';
import { useSessionProvider } from '../providers/SessionProvider';

const MainView: Component = () => {
  const navigate = useNavigate();
  const { session, setSession, isPageSensitive, user } = useSessionProvider();

  const loginRef = `/login?ref=${location.pathname}`;

  return (
    <>
      <Switch>
        <Match when={user.loading}>
          <h3>Loading</h3>
        </Match>

        <Match when={!user.loading}>

          <Switch>

            <Match when={user.error && isPageSensitive()}>
              <h4>{"Please login to view this page"}</h4>
              <A href={loginRef}><button type='button'>Login</button></A>
            </Match>

            <Match when={!user.error || !isPageSensitive()}>
              <header class={styles.header}>
                <Switch>
                  <Match when={user.state === 'errored'}>
                    <div class={styles.left_float}>
                      <A href={loginRef}><button type='button'>Login</button></A>
                    </div>
                  </Match>

                  <Match when={user.state === 'ready'}>
                    <ContextMenu center yToggle yOffset={5} width={100}
                      onClickOff={UpdateUserDropdown} 
                      onSelect={UpdateUserDropdown} 
                      options={[
                        { id: 'Home', hide: (location.pathname === '/home'), action(e) { navigate('/home') } },
                        { id: 'Bubbles', hide: (location.pathname === '/bubbles'), action(e) { navigate('/bubbles') } },
                        { id: 'Logout', danger: true, action: async () => {
                          await trpc.auth.logout.mutate();
                          setSession('');
                          navigate('/login')
                        } } 
                      ]}
                    >

                      <div class={styles.left_float} style={{ cursor: 'pointer' }} onClick={UpdateUserDropdown}>
                        <h5 style={{ 'margin-right': '10px' }}>{user.latest?.username}</h5>
                        <FeatherIcon id='user_dropdown' class='-smooth_rotate' icon={FeatherIcons['chevron-down']} options={{ height: 24, "stroke-width": 2 }} />
                      </div>

                    </ContextMenu>
                  </Match>
                </Switch>

                <div class={styles.right_float}>
                  {/* <FeatherIcon icon={FeatherIcons.star} options={{ height: 24, "stroke-width": 2 }}/> */}
                  <FeatherIcon icon={FeatherIcons.settings} options={{ height: 24, "stroke-width": 2 }}/>
                </div>
              </header>
              <div class={styles.mainContent}>
                <Outlet/>
              </div>
            </Match>

          </Switch>

        </Match>
      </Switch>
    </>
  );
};

export default MainView;

function UpdateUserDropdown () {
  const svg = document.getElementById('user_dropdown') as SVGElement | null;
  if (!svg) return;
  if (['0deg', ''].includes(svg.style.rotate)) svg.style.rotate = '-180deg';
  else svg.style.rotate = '0deg';
}