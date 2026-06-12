import { Component, OnInit } from '@angular/core';

// type
import { CardDropdownOption } from '../../shared/widget/card-title/card-title.model';
import { ChatMessage } from '../../shared/widget/chat/chat.model';
import { BreadcrumbItem } from '../../shared/page-title/page-title.model';
import { ChartStatisticsItem } from '../../shared/widget/chart-statistics/chart-statistics.model';
import { ChartStatistics2Item } from '../../shared/widget/chart-statistics2/chart-statistics2.model';
import { ChartItem } from '../../shared/widget/chart/chart.model';
import { RecentActivity } from '../../shared/widget/recent-activity/recent-activity.model';
import { StatisticsItem } from '../../shared/widget/statistics/statistics.model';
import { ToDoItem } from '../../shared/widget/todo/todo.model';
import { TransactionItem } from '../../shared/widget/transaction/transaction.model';

// data
import { chatMessages } from '../../shared/widget/chat/data';
import { chartData, chartStatistics2Data, chartStatisticsData, recentActivities, statisticsData, todoItems, transactionData } from './data';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class WidgetsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  dropdownOptions: CardDropdownOption[] = [{ label: 'Settings' }, { label: 'Action' }];
  statisticsData: StatisticsItem[] = [];
  chartStatisticsData: ChartStatisticsItem[] = [];
  chartWidgetData: ChartItem[] = [];
  todoList: ToDoItem[] = [];
  recentActivities: RecentActivity[] = [];
  transactionList: TransactionItem[] = [];
  chartStatistics2Data: ChartStatistics2Item[] = [];
  remainingTask: number = 0;
  chatMessages: ChatMessage[] = [];


  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Widgets', path: '/', active: true }];
    this._fetchData();
    this.remainingTask = this.todoList.filter((todoItem: ToDoItem) => todoItem.status === 'inprogress').length;
  }

  /**
   * fetches widget data
   */
  _fetchData(): void {
    this.statisticsData = statisticsData;
    this.chartStatisticsData = chartStatisticsData;
    this.chartWidgetData = chartData;
    this.todoList = todoItems;
    this.recentActivities = recentActivities;
    this.transactionList = transactionData;
    this.chartStatistics2Data = chartStatistics2Data;
    this.chatMessages = chatMessages;
  }

  /**
   * adds new task in todo list
   * @param newTask task to be added in list
   */
  addTask(newTask: string): void {
    const newTaskItem: ToDoItem = {
      id: this.todoList.length + 1,
      text: newTask,
      status: 'inprogress'
    }
    this.todoList.push(newTaskItem);
  }


  /**
   * Archives the todos
   */
  archiveTodos(): void {
    this.todoList = this.todoList.filter((todoItem: ToDoItem) => todoItem.status !== 'completed');
  }



}
