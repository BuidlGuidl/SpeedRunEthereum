import React from "react";
import { useHistory } from "react-router-dom";

export default function ProfileView({ userObject, userName }) {
    const history = useHistory();
    if (userObject == null || Object.keys(userObject).length === 0) {
        history.push("/")
    }
    console.log(Object.keys(userObject).map(_ => <div>Test</div>))
    return (
        <div>
            <h1>Welcome {userName}!</h1>
            <ul> {
                Object.keys(userObject.challenges).map(challengeKey => (
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