import React from "react";
import SignUpClassesDetails from "./signUpClassesDetails";

const ProfileDetails = ({ user }) => (
  <div className="profile-details">
    <div className="left-container">
      <img className="profile-img" src={user.slack_photo_link} alt="Profile Image" />
      <table>
        <tbody>
          <tr>
            <td>Name :</td>
            <td>{`${user.slack_firstname} ${user.slack_lastname}`}</td>
          </tr>
          <tr>
            <td>Email :</td>
            <td>{user.email}</td>
          </tr>
          <tr>
            <td>Role :</td>
            <td>{user.slack_title}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="right-container">
      <SignUpClassesDetails  />
    </div>
  </div>
);

export default ProfileDetails;