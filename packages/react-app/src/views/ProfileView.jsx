import React, { useState } from "react";
import { BrowserRouter, Switch, Route, Link, useHistory } from "react-router-dom";

export default function ProfileView({ userObject, userName }) {
    const history = useHistory();
    if (userObject == null) {
        history.push("/")
    }
    return (
        <div>
            <h1>Welcome {userName}!</h1>
            <ul>
                {Object.keys(userObject?.challenges).map(challengeKey => (
                    <li key={challengeKey}>
                        <span>{challengeKey}</span>
                        <span>{userObject.challenges[challengeKey].url}</span>
                        <span>{userObject.challenges[challengeKey].status}</span>
                    </li>
                ))}
            </ul>

        </div>
    )
}