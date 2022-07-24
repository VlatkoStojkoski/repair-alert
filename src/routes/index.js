import React from 'react';
import { Switch, Route } from 'react-router-dom';

import BigContainer from '../components/BigContainer';
import Navigation from '../layout/Navigation';
import SignUp from './SignUp';
import SignIn from './SignIn';
import NewPost from './NewPost';
import Home from './Home';
import Post from './Post';
import Profile from './Profile';

const Routes = () => (
    <>
      <Navigation />
      <Switch>
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route exact path="/signup">
          <BigContainer>
            <SignUp />
          </BigContainer>
        </Route>
        <Route exact path="/signin">
          <BigContainer>
            <SignIn />
          </BigContainer>
        </Route>
        <Route exact path="/new-post">
          <NewPost />
        </Route>
        <Route path="/post">
          <Post />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </>
  );

export default Routes;
