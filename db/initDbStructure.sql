-- Create Database
DROP DATABASE IF EXISTS wichtel;
CREATE DATABASE IF NOT EXISTS wichtel;

-- Select the Database
USE wichtel;

-- Benutzer (Users) Table
CREATE TABLE IF NOT EXISTS users
(
    userid   INT auto_increment PRIMARY KEY,
    email    VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    surname    VARCHAR(255) NOT NULL,
    lastname    VARCHAR(255) NOT NULL
);

-- Events Table
CREATE TABLE IF NOT EXISTS events
(
    eventid       INT auto_increment PRIMARY KEY,
    name          VARCHAR(50),
    creatoruserid INT,
    pricelimit    DECIMAL(10, 2),
    eventdate     DATE,
    status        VARCHAR(50),
    FOREIGN KEY (creatoruserid) REFERENCES users (userid)
);

-- Teilnehmer (Participants) Table
CREATE TABLE IF NOT EXISTS participants
(
    participantid INT auto_increment PRIMARY KEY,
    userid        INT,
    eventid       INT,
    giftwish      VARCHAR(255),
    FOREIGN KEY (userid) REFERENCES users (userid),
    FOREIGN KEY (eventid) REFERENCES events (eventid)
);

-- Einladungen (Invitations) Table
CREATE TABLE IF NOT EXISTS invitations
(
    invitationid     INT auto_increment PRIMARY KEY,
    participantid    INT,
    invitationstatus VARCHAR(50),
    FOREIGN KEY (participantid) REFERENCES participants (participantid)
);

-- Zuordnungen (Assignments) Table
CREATE TABLE IF NOT EXISTS assignments
(
    assignmentid INT auto_increment PRIMARY KEY,
    giverid      INT,
    receiverid   INT,
    eventid      INT,
    FOREIGN KEY (giverid) REFERENCES participants (participantid),
    FOREIGN KEY (receiverid) REFERENCES participants (participantid),
    FOREIGN KEY (eventid) REFERENCES events (eventid)
);