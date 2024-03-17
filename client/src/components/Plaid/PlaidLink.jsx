import React, { useContext, useState, useEffect, useCallback } from "react";
import Button from "plaid-threads/Button";

import { usePlaidLink } from "react-plaid-link";

import Context from "../../context/Context";

function PlaidLink() {
    const { linkToken, linkSuccess, isItemAccess, isPaymentInitiation, dispatch } = useContext(Context);

    ///////////////// FROM: Plaid Quickstart App //////////////
    const getInfo = useCallback(async () => {
        const response = await fetch("http://127.0.0.1:5555/api/info", { method: "POST" });
        if (!response.ok) {
          dispatch({ type: "SET_STATE", state: { backend: false } });
          return { paymentInitiation: false };
        }
        const data = await response.json();
        const paymentInitiation = false;
        // const paymentInitiation = data.products.includes(
        //   "payment_initiation"
        // );
        dispatch({
          type: "SET_STATE",
          state: {
            products: data.products,
            isPaymentInitiation: paymentInitiation,
          },
        });
        return { paymentInitiation };
      }, [dispatch]);
    
      const generateToken = useCallback(
        async () => {
          // Link tokens for 'payment_initiation' use a different creation flow in your backend.
          const path = "http://127.0.0.1:5555/api/create_link_token"
          // const path = isPaymentInitiation
          //   ? "http://127.0.0.1:5555/api/create_link_token_for_payment"
          //   : "http://127.0.0.1:5555/api/create_link_token";
          const response = await fetch(path, {
            method: "POST",
          });
          if (!response.ok) {
            dispatch({ type: "SET_STATE", state: { linkToken: null } });
            return;
          }
          const data = await response.json();
          if (data) {
            if (data.error != null) {
              dispatch({
                type: "SET_STATE",
                state: {
                  linkToken: null,
                  linkTokenError: data.error,
                },
              });
              return;
            }
            dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } });
          }
          // Save the link_token to be used later in the Oauth flow.
          localStorage.setItem("link_token", data.link_token);
        },
        [dispatch]
      );
    
      useEffect(() => {
        const init = async () => {
          const { paymentInitiation } = await getInfo(); // used to determine which path to take when generating token
          // do not generate a new token for OAuth redirect; instead
          // setLinkToken from localStorage
          if (window.location.href.includes("?oauth_state_id=")) {
            dispatch({
              type: "SET_STATE",
              state: {
                linkToken: localStorage.getItem("link_token"),
              },
            });
            return;
          }
          generateToken(paymentInitiation);
        };
        init();
      }, [dispatch, generateToken, getInfo]);


    ///////////////// FROM: Plaid Quickstart Link/index ///////////
    const onSuccess = React.useCallback(
      (public_token) => {
        // If the access_token is needed, send public_token to server
        const exchangePublicTokenForAccessToken = async () => {
          const response = await fetch("http://127.0.0.1:5555/api/set_access_token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: `public_token=${public_token}`,
          });
          if (!response.ok) {
            dispatch({
              type: "SET_STATE",
              state: {
                itemId: `no item_id retrieved`,
                accessToken: `no access_token retrieved`,
                isItemAccess: false,
              },
            });
            return;
          }
          const data = await response.json();
          dispatch({
            type: "SET_STATE",
            state: {
              itemId: data.item_id,
              accessToken: data.access_token,
              isItemAccess: true,
            },
          });
        };
  
        // 'payment_initiation' products do not require the public_token to be exchanged for an access_token.
        // if (isPaymentInitiation){
        //   dispatch({ type: "SET_STATE", state: { isItemAccess: false } });
        // } else {
          exchangePublicTokenForAccessToken();
        // }
  
        dispatch({ type: "SET_STATE", state: { linkSuccess: true } });
        window.history.pushState("", "", "/");
      },
      [dispatch]
    );
  
    let isOauth = false;
    const config = {
      token: linkToken,
      onSuccess,
    };
  
    // if (window.location.href.includes("?oauth_state_id=")) {
    //   // TODO: figure out how to delete this ts-ignore
    //   // @ts-ignore
    //   config.receivedRedirectUri = window.location.href;
    //   isOauth = true;
    // }
  
    const { open, ready } = usePlaidLink(config);
  
    useEffect(() => {
      if (isOauth && ready) {
        open();
      }
    }, [ready, open, isOauth]);
  
    return (
      <Button 
        type="button" 
        large onClick={() => open()} 
        disabled={!ready}
      >
        Launch Link
      </Button>
    );
}

export default PlaidLink