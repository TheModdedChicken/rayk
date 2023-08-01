import { onMount, type Component, createRenderEffect, createResource, Switch, Match, createSignal, Show } from 'solid-js';

import styles from './Bubbles.module.css';
import FeatherIcon, { FeatherIcons } from '../components/FeatherIcon';
import TextArea from '../components/TextArea';

import bubble from '../../assets/icons/svg/bubble.svg';
import { useSessionProvider } from '../providers/SessionProvider';
import Header from '../components/Header';
import { RouterInput, trpc } from '../trpc';
import Bubble from '../components/Bubble';
import Modal from '../components/Modal';
import { BubbleRegex } from 'api/src/utility/regex';
import { TRPCClientError } from '@trpc/client';

const BubbleView: Component = () => {
  const { user } = useSessionProvider();
  const [ bubbleData, { refetch: refetchBubbles } ] = createResource(async () => await trpc.bubbles.getBubblesFromUser.query({ select: { name: true, visibility: true } }));

  const [ createBubbleModal, toggleCreateBubbleModal ] = createSignal(false);

  const [ createBubbleMessage, setCreateBubbleMessage ] = createSignal<string | false>(false);

  return (
    <>
      <header class={styles.header}>
        <Header title={'Your Bubbles'}>
          <button style={{ padding: '6px' }} onClick={() => toggleCreateBubbleModal(!createBubbleModal())}>
            <FeatherIcon icon={FeatherIcons.plus} options={{ height: 22 }}/>
          </button>
        </Header>
      </header>
      <div class={styles.mainContent}>
        <Switch>
          <Match when={user.loading || bubbleData.loading}>
            <h6>Loading bubbles...</h6>
          </Match>

          <Match when={user.error || bubbleData.error}>
            <h6>Encountered an Error</h6>
          </Match>

          <Match when={user.state === 'ready' && bubbleData.state === 'ready'}>
            <Modal show={createBubbleModal()} onClickOff={() => { toggleCreateBubbleModal(false); setCreateBubbleMessage(false) }}>
              <div style={{ 'text-align': 'center' }}>
                <h6>Create Bubble</h6>
                <form class={styles.create_bubble_form} onSubmit={async (e) => {
                  e.preventDefault();
                  setCreateBubbleMessage(false);
                  const name = (document.getElementById('create_bubble_name') as HTMLInputElement).value;
                  const visibility = (document.getElementById('create_bubble_visibility') as HTMLInputElement).value.toUpperCase() as RouterInput['bubbles']['createBubble']['visibility'];

                  try {
                    await trpc.bubbles.createBubble.query({ name, visibility });
                    refetchBubbles();
                    toggleCreateBubbleModal(false);
                  } catch (e) {
                    if (e instanceof TRPCClientError) {
                      setCreateBubbleMessage(`${e.message}`);
                      return false;
                    }
                  }
                }}>
                  <input type='text' id='create_bubble_name' placeholder='Name' pattern={BubbleRegex.source} required autocomplete='off'></input>
                  <select id='create_bubble_visibility'>
                    <option>Public</option>
                    <option>Anonymous</option>
                    <option>Unlisted</option>
                    <option>Private</option>
                  </select>
                  <button type='submit'>Create</button>
                  <Show when={createBubbleMessage()}>
                    <p style={{ color: 'var(--danger-color)' }}>{createBubbleMessage()}</p>
                  </Show>
                </form>
              </div>
            </Modal>
            {
              bubbleData.latest?.length === 0
              ? <h6>{'No bubbles to show :('}</h6>
              : bubbleData.latest?.map((b) => {
                return <Bubble 
                  name={b.name || 'Err'}
                  visibility={b.visibility}
                />;
              })
            }
          </Match>
        </Switch>
      </div>
      <footer class={styles.footer}>
      </footer>
    </>
  );
};

export default BubbleView;