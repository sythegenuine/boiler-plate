import React, {useEffect} from "react"
import Axios from "axios"
import {useDispatch} from 'react-redux'
import {auth} from '../_actions/user_action'
export default function (SpecificComponent, option, adminRoute = null) {
    function AuthenticationCheck(props) {
        const dispatch = useDispatch();
        useEffect(() => {
//null
//true - 로그인만 출입 가능
//false - 로그인한 유저는 출입불가
            dispatch(auth()).then(Response => {
                console.log(Response)
           
         
            //login not
            if(!Response.payload.isAuth) {
                if(option) {
                    props.history.push('/login')
                
                }
            } else {
                //logged in
                if(adminRoute&& !Response.payload.isAdmin) {
                    props.history.push('/')
                } else {
                    if (option === false)
                        props.history.push('/')
                }
            }
           
        })}, [])
        return (
            <SpecificComponent />
        )
    }
    return AuthenticationCheck
}