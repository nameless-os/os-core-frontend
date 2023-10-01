// Libraries
import { configureStore } from '@reduxjs/toolkit';

// Redux
import chatSlice, { addMessageInputValue, changeMessageInputValue, clearMessageInputValue, setMessages } from './chatSlice';

describe('chatSlice', () => {
  let storeMock = configureStore({
    reducer: {
      chat: chatSlice,
    },
  });

  beforeEach(() => {
    storeMock = configureStore({
      reducer: {
        chat: chatSlice,
      },
    });
  });

  it('setMessages should replace messages and increment the numberOfRender', () => {
    const fakeMessage = {
      id: 1,
      text: 'wqd',
      username: 'John',
      date: '01.03.2000',
      photo: '',
      createdAt: '05.02.2000' as unknown as Date,
      owner: {
        username: 'testUser333',
        photo: '',
        id: 3,
      },
      listOfReaders: [],
    };

    storeMock.dispatch(setMessages([fakeMessage]));

    expect(storeMock.getState().chat.messages).toHaveLength(1);
    expect(storeMock.getState().chat.messages[0]).toEqual(fakeMessage);
    expect(storeMock.getState().chat.numberOfRender).toEqual(1);
  });

  it('addMessageInputValue should add value to the text', () => {
    storeMock.dispatch(addMessageInputValue('h'));

    expect(storeMock.getState().chat.text).toEqual('h');
  });

  it('changeMessageInputValue should replace the text', () => {
    storeMock.dispatch(changeMessageInputValue('hello'));

    expect(storeMock.getState().chat.text).toEqual('hello');
  });

  it('clearMessageInputValue should reset the text value', () => {
    storeMock.dispatch(changeMessageInputValue('hello'));
    storeMock.dispatch(clearMessageInputValue());

    expect(storeMock.getState().chat.text).toEqual('');
  });
});
