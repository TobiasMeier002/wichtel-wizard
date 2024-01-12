-- Create Database
CREATE
DATABASE wichtel;

-- Select the Database
USE wichtel;

-- Benutzer Tabelle
CREATE TABLE Users
(
    UserID   INT PRIMARY KEY,
    Email    VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL
);

-- Events Tabelle
CREATE TABLE Events
(
    EventID       INT PRIMARY KEY,
    CreatorUserID INT,
    PriceLimit    DECIMAL(10, 2),
    EventDate     DATE,
    Status        VARCHAR(50),
    FOREIGN KEY (CreatorUserID) REFERENCES Users (UserID)
);

-- Teilnehmer Tabelle
CREATE TABLE Participants
(
    ParticipantID INT PRIMARY KEY,
    UserID        INT,
    EventID       INT,
    GiftWish      VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES Users (UserID),
    FOREIGN KEY (EventID) REFERENCES Events (EventID)
);

-- Einladungen Tabelle
CREATE TABLE Invitations
(
    InvitationID     INT PRIMARY KEY,
    ParticipantID    INT,
    InvitationStatus VARCHAR(50),
    FOREIGN KEY (ParticipantID) REFERENCES Participants (ParticipantID)
);

-- Zuordnungen Tabelle
CREATE TABLE Assignments
(
    AssignmentID INT PRIMARY KEY,
    GiverID      INT,
    ReceiverID   INT,
    EventID      INT,
    FOREIGN KEY (GiverID) REFERENCES Participants (ParticipantID),
    FOREIGN KEY (ReceiverID) REFERENCES Participants (ParticipantID),
    FOREIGN KEY (EventID) REFERENCES Events (EventID)
);
