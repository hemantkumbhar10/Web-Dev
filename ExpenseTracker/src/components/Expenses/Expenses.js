import React, {useState} from "react";

import ExpenseItem from "../Expenses/ExpenseItem";
import "../Expenses/Expenses.css";
import Card from "../UI/Card";
import ExpenseFilter from "../Expenses/ExpenseFilter";
import ExpensesList from "./ExpensesList";
import ExpensesChart from "./ExpensesChart";

const Expenses = (props) => {
  const [filteredYear, setFilteredYear] = useState('2019');

  const filterChangeHandler = selectedYear =>{
    setFilteredYear(selectedYear);
    // console.log(selectedYear);
  }


  const afterFilterExpenses = props.items.filter((expense)=>{
    if(expense.date.getFullYear().toString() === filteredYear){
      return expense;
    };
  });


  return (
    <div>
      <Card className="expenses">
        <ExpenseFilter selected={filteredYear} onChangeFilter={filterChangeHandler}/>
        <ExpensesChart expenses={afterFilterExpenses}/>
        <ExpensesList items={afterFilterExpenses}/>
      </Card>
    </div>
  );
};

export default Expenses;
