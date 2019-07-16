/*
  路由权限验证通用组件
*/
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default function AuthCheck(props) {
  // console.log(props)
  let {path, component: Component} = props;
  // let Component = props.component;
  // return <Component/>
  let token = sessionStorage.getItem('mytoken');
  return (
    <Route path={path} render={()=>{
      // 这里可以返回原始组件component对应的内容
      return token?<Component/>: <Redirect to='/login'/>;
    }}/>
  );
}