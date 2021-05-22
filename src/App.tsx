import React from 'react';
import logo from './logo.svg';
import './App.css';

import * as azdev from "azure-devops-node-api";
import * as ba from "azure-devops-node-api/BuildApi";
import * as WorkInterfaces from 'azure-devops-node-api/interfaces/WorkInterfaces';
import * as WorkApi from 'azure-devops-node-api/WorkApi';
import * as CoreInterfaces from 'azure-devops-node-api/interfaces/CoreInterfaces';
import * as CoreApi from 'azure-devops-node-api/CoreApi';

import * as ta from "azure-devops-node-api/TaskAgentApi";
import * as ti from "azure-devops-node-api/interfaces/TaskAgentInterfaces";

import * as WorkItemTrackingApi from 'azure-devops-node-api/WorkItemTrackingApi';
import * as WorkItemTrackingInterfaces from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';

function App() {
  const test = async () => {

    // your collection url
    let orgUrl: any = process.env.REACT_APP_API_URL;
    let projectName: any = process.env.REACT_APP_API_PROJECT;

    let token: any = process.env.REACT_APP_API_TOKEN; // e.g "cbdeb34vzyuk5l4gxc4qfczn3lko3avfkfqyb47etahq6axpcqha"; 

    let authHandler = azdev.getPersonalAccessTokenHandler(token);
    let connection = new azdev.WebApi(orgUrl, authHandler);
    console.log(connection)   //this is your api connection


    //build
    let build: ba.IBuildApi = await connection.getBuildApi();
    async function run() {
      // let project: string = projectName;
      // let defs: bi.DefinitionReference[] = await build.getDefinitions(project);

      // defs.forEach((defRef: bi.DefinitionReference) => {
      //   console.log(`${defRef.name} (${defRef.id})`);
      // });

      //work
      const workApiObject: WorkApi.IWorkApi = await connection.getWorkApi();
      const coreApiObject: CoreApi.CoreApi = await connection.getCoreApi();
      const project: CoreInterfaces.TeamProject = await coreApiObject.getProject("d26831d6-0711-4b76-bd21-ae6fbee26ee1");
      const witApi: WorkItemTrackingApi.IWorkItemTrackingApi = await connection.getWorkItemTrackingApi();
      const teamContext: CoreInterfaces.TeamContext = {
        project: project.name,
        projectId: project.id,
        team: project.defaultTeam?.name,
        teamId: project.defaultTeam?.id
      };

      const boards: WorkInterfaces.BoardReference[] = await workApiObject.getBoards(teamContext);

      const queries: WorkItemTrackingInterfaces.QueryHierarchyItem[] = await witApi.getQueries(project.id!);
      console.log(queries)
      var today = new Date();
      const workItems: any = await witApi.getWorkItems(
        [1,2,3,4],
        [],
        today,
        0,
        1,
        project.id!
      );
        console.log("here's the work item")
      console.log(workItems)

     


      // console.log('This project has', boards.length, 'boards');
      // console.log(boards)

      // const board: WorkInterfaces.BoardReference = boards[1];

      // console.log(board.name)

      // const boardColumn: WorkInterfaces.BoardReference[] = await workApiObject.getBoardColumns(teamContext, board.id!);
      // const workItem: WorkInterfaces.TaskboardWorkItemColumn[] = await workApiObject.getWorkItemColumns(teamContext, "1");

      // console.log(boardColumn)
      // console.log(workItem)

      // const boardRows: WorkInterfaces.BoardReference[] = await workApiObject.getBoardRows(teamContext, board.id!);
      // console.log(boardRows)

      // console.log("```````````````````````")
      // let vstsTask: ta.ITaskAgentApi = await connection.getTaskAgentApi();
      // let tasks: ti.TaskDefinition[] = await vstsTask.getTaskDefinitions();
      //   console.log(`You have ${tasks.length} task definition(s)`);
      //   console.log(tasks);




    }

    run();


  }

  test();


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
