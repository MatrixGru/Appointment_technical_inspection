import {Component, Input, OnInit} from '@angular/core';
import * as XLSX from 'xlsx';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDateRangePicker} from '@angular/material/datepicker';

@Component({
  selector: 'app-get-records',
  templateUrl: './get-records.component.html',
  styleUrls: ['./get-records.component.css']
})
export class GetRecordsComponent implements OnInit {

  @Input() records: object;
  fileName = 'ExcelSheet.xlsx';
  nowDate = Date.parse(new Date().toLocaleDateString('en-En', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })).toString();
  selectedFilter: number;
  searchWord: string;
  // Поля по которым осуществляется поиск
  searchFields = ['email', 'phone', 'fio', 'mark', 'description'];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });




  constructor() {
  }

  ngOnInit(): void {
    // Устанавливаем фильтр - Новые записи
    this.selectedFilter = 1;
    // Поисковое слово (пустое по умолчанию)
    this.searchWord = '';
  }

  // Экспорт в Эксель
  exportexcel(): void {
    /* table id is passed over here */
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

// Конвертиция даты в unix
  convertDate(dateConvert: string): string {
    return Date.parse(new Date(dateConvert).toLocaleDateString('en-En', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })).toString();
  }

  // Конвертация Unix в дату
  reverseConvertDate(dateConvert: string): string {
    return new Date(Number(dateConvert)).toLocaleDateString('en-GB');
  }

  // Фильтруем записи на новые (те записи которые были сделаны не ранее текущего дня)
  filterNewRecords(data: object): any {
    const filterRecords = new Array();
    let i = 0;
    for (const rec of Object.keys(data)) {
      if (Number(this.records[rec].datex) >= Number(this.nowDate)) {
        filterRecords.push(this.records[rec]);
        i++;
      }
    }
    return filterRecords;
  }


  // Фильтруем записи на прошедшие (те записи которые были сделаны ранее текущего дня)
  filterLastRecords(data: object): any {
    const filterRecords = new Array();
    let i = 0;
    for (const rec of Object.keys(data)) {
      if (Number(this.records[rec].datex) < Number(this.nowDate)) {
        filterRecords.push(this.records[rec]);
        i++;
      }
    }
    return filterRecords;
  }

  // Фильтруем записи на прошедшие (те записи которые были сделаны ранее текущего дня)
  filterCurrentRecords(data: object): any {
    const filterRecords = new Array();
    let i = 0;
    for (const rec of Object.keys(data)) {
      if (Number(this.records[rec].datex) === Number(this.nowDate)) {
        filterRecords.push(this.records[rec]);
        i++;
      }
    }
    return filterRecords;
  }


  // Применение фильтра при обновлении данных
  filterData(data: object): object {
    switch (this.selectedFilter) {
      case 1:
        return this.filterNewRecords(data);
        break;
      case 2:
        return this.filterLastRecords(data);
        break;
      case 3:
        return this.filterCurrentRecords(data);
        break;
      case 0:
      default:
        return data;
        break;
    }
  }

  // Поиск во входном массиве вхождения
  filterSearch(inputValue: string, data: object): object {
    const filterRecords = new Array();
    let i = 0;
    if (0 < inputValue.length) {
      for (const rec of Object.keys(data)) {
        for (const val of Object.keys(data[rec])) {
          // Исключаем поля из поиска
          if (this.searchFields.indexOf(val) === -1) {
            continue;
          }
          // Если имеется вхождение добавляем запись в результирующий массив
          if (data[rec][val].toString().indexOf(inputValue) !== -1) {
            filterRecords.push(this.records[rec]);
            i++;
            break;
          }
        }
      }
    } else {
      return data;
    }
    return filterRecords;
  }

  // Вспомогательный метод вызова поиска
  searchInCurrentData(event: any): void {
    const value = event.target.value;
    this.searchWord = value;
    this.filterSearch(value, this.records);
  }

  // Обработка выбора Фильтра
  onChange(event: any): void {
    const value = event.target.value;
    switch (value) {
      case '1':
        // Новые записи
        this.selectedFilter = 1;
        this.filterData(this.records);
        break;
      case '2':
        // Старые записи
        this.selectedFilter = 2;
        this.filterData(this.records);
        break;
      case '3':
        // Записи на сегодня
        this.selectedFilter = 3;
        this.filterData(this.records);
        break;
      case '0':
      default:
        // Все записи
        this.selectedFilter = 0;
        this.filterData(this.records);
        break;
    }
  }

  filterDataPeriod(data: object, filterData: object): object{
      if (this.range.value.start !== null && this.range.value.end !== null){
        const filterRecords = new Array();
        let i = 0;
        for (const rec of Object.keys(data)) {
          if (Number(this.records[rec].datex) >= Number(this.convertDate(this.range.value.start)) && Number(this.records[rec].datex) <= Number(this.convertDate(this.range.value.end))) {
            filterRecords.push(this.records[rec]);
            i++;
          }
        }
        return filterRecords;
      }

      return filterData;
  }

  filterRecords(records: object): object {
    let tempRecords = {};
    tempRecords = this.filterData(records);
    tempRecords = this.filterDataPeriod(records, tempRecords);
    tempRecords = this.filterSearch(this.searchWord, tempRecords);

    return tempRecords;
  }

  clearDatePicker(picker: MatDateRangePicker<any>): void {
      this.range.controls['start'].setValue(null);
      this.range.controls['end'].setValue(null);
  }
}
