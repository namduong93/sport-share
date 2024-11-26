import styled from 'styled-components';
import './App.css'
import React, { useState } from 'react'


const InputLabel = styled.label`
  min-width: 145px;
  max-width: 200px;
  min-height: 35px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F9F9F9;
  border: 1px solid black;
  margin-bottom: 10px;
  font-weight: 600;
  transition: background-color 0.5s ease;

  &:hover {
    cursor: pointer;
    background-color: lightblue;
  }
`;

const StyledButton = styled.button`
  width: 145px;
  height: 35px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F9F9F9;
  border: 1px solid black;
  transition: background-color 0.5s ease;

  &:hover {
    cursor: pointer;
    border: 1px solid black;
    background-color: lightblue;
  }
`;

interface Member {
  name: string;
  email: string;
  title: string;
  sex: string;
};

interface Team {
  teamName: string;
  members: Member[]
}

const sexMap: Record<string, string> = {
  "Male": "Male",
  "Female": "Female",
  "M": "Male",
  "F": "Female"
}

const parseFile = async (file: File) => {
  return new Promise<Team[]>((resolve, _) => {
    if (file.type !== 'text/csv') {
      alert('File must be a csv file');
      return [];
    }

    const teamObject: Record<string, Team> = {};

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (!e.target) {
        return;
      }
      const lines = (e.target.result as string).trim().split('\n');
      
      for (const line of lines.slice(1)) {
        const [_, __, teamName, name, email, title, sex, ___, teamId] = line.split(',');
        
        if (!teamObject[teamId]) {
          teamObject[teamId] = { teamName, members: [] };
        }
      
        teamObject[teamId].members.push({ 
          name, email, title, sex: sexMap[sex] 
        });
        
      }

      resolve(Object.values(teamObject).map(({ teamName, members }) => ({ teamName, members })) as Team[]);
    }

    fileReader.readAsText(file);
  });
}

function App() {

  const [file, setFile] = useState<File | undefined>();

  const handleClick = async () => {

    if (!file) {
      alert('Please upload a csv file');
      return;
    }

    const teamList = await parseFile(file);

    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: async (teamList) => {

        const addTeamButton = document.querySelector(
          "#root > div > div > main > div > div:nth-child(2) > div > div > div:nth-child(1) > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-2 > span > button"
        ) as HTMLButtonElement;

        const inputEvent = new Event('input', { bubbles: true });
        const keyboardSelectEvent = new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' });

        for (const team of teamList) {
          const nameInputs = document.querySelectorAll("#margin-none");
          const nameInput = nameInputs[nameInputs.length - 1] as HTMLInputElement;
          nameInput.value = team.teamName;
          nameInput.dispatchEvent(new Event('input', { bubbles: true }));
          const captionElements = document.getElementsByClassName('MuiTypography-root MuiTypography-caption');
          const registerUserButtons = [];
          for (const captionElement of captionElements) {
            if ((captionElement as HTMLElement).innerText === 'Register new person.') {
              registerUserButtons.push(captionElement);
            }
          }

          for (const [index, member] of team.members.entries()) {

            const memberInputs = document.getElementsByClassName('MuiInputBase-input MuiInput-input');
            const memberInput = memberInputs[memberInputs.length - 1 - (2 - index)] as HTMLInputElement;

            memberInput.value = member.email;
            memberInput.dispatchEvent(new Event('input', { bubbles: true }));

            const currentRegisterUserButton = registerUserButtons[registerUserButtons.length - 1 - (2 - index)] as HTMLSpanElement;

            currentRegisterUserButton.addEventListener('click', async () => {

              const prevElementSize = document.getElementsByClassName('MuiInputBase-input MuiInput-input').length;
              const userRegInterval = setInterval(() => {

                const elements = document.getElementsByClassName('MuiInputBase-input MuiInput-input');
                if (elements.length !== prevElementSize + 5) {
                  return;
                }

                  const usernameInput = elements[elements.length - 5] as HTMLInputElement;
                  const firstNameInput = elements[elements.length - 3] as HTMLInputElement;
                  const lastNameInput = elements[elements.length - 2] as HTMLInputElement;
            
                  usernameInput.value = member.email;
                  usernameInput.dispatchEvent(inputEvent);

                  const nameList = member.name.split(' ');
                  const firstName = nameList[0];
                  const lastName = nameList[nameList.length - 1];

                  firstNameInput.value = firstName;
                  firstNameInput.dispatchEvent(inputEvent);

                  lastNameInput.value = lastName;
                  lastNameInput.dispatchEvent(inputEvent);

                  const selectElements = document.getElementsByClassName(
                    'MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiInputBase-input MuiInput-input'
                  );

                  const [titleSelectElement, sexSelectElement] = selectElements;

                  titleSelectElement.dispatchEvent(keyboardSelectEvent);

                  const titleInterval = setInterval(() => {
                    const titleElements = document.getElementsByClassName(
                      'MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button'
                    );

                    if (!titleElements.length) {
                      return;
                    }

                    for (const titleElement of titleElements) {
                      if ((titleElement as HTMLElement).innerText === member.title) {
                        (titleElement as HTMLElement).click();
                      }
                    }
                    clearInterval(titleInterval);

                    // interval has already been cleared at this point so doesn't risk having crazy
                    // nested intervals

                    if (!member.sex) {
                      return;
                    }

                    sexSelectElement.dispatchEvent(keyboardSelectEvent);
                    const sexInterval = setInterval(() => {

                      const sexElements =  document.getElementsByClassName(
                        'MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button'
                      );

                      if (!sexElements.length) {
                        return;
                      }

                      for (const sexElement of sexElements) {
                        if ((sexElement as HTMLElement).innerText === member.sex) {
                          (sexElement as HTMLElement).click();
                        }
                      }

                      clearInterval(sexInterval);

                    }, 100);

                  }, 100);
              
                  clearInterval(userRegInterval);
              }, 100);

            })

          }
          addTeamButton.click();
          
        }
        
      },
      args: [teamList]
    })
  }


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    setFile(e.target.files[0]);
  }

  return (
    <>
      <h1>Auto Coach</h1>
      <div className="card">
        
        <div style={{ display: 'flex', gap: '10px' }}>
        <input onChange={handleFileChange} style={{ display: 'none' }} id="csv-input" type='file' />
        <InputLabel htmlFor='csv-input'>{file?.name || 'CSV File Upload'}</InputLabel>

        <StyledButton onClick={handleClick}>
          Submit Teams
        </StyledButton>
        </div>
      </div>
    </>
  )
}

export default App
