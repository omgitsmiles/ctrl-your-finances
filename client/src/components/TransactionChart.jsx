import React from 'react'
import { Chart } from "react-google-charts";
import { useLocation } from 'react-router-dom';

import CustomCard from './CustomCard';
import Navbar from './Navbar';
import { UserAuth } from '../context/AuthContext';

const options = {
  title: "Your Spending",
  backgroundColor: "transparent",
  titleTextStyle: {
      color: '#B2BEB5'
  },
  legendTextStyle: {
      color: '#B2BEB5'
  },
  pieHole: 0.3,
  is3D: false,
};

const TransactionChart = () => {
  // const location = useLocation()
  // const { transactionData } = location.state

  // console.log("TransactionData:", transactionData)
  // console.log(transactionData.latest_transactions)

  const { transactions } = UserAuth();

  const newData = transactions ? transactions.map((categoryGroup) => {
      const category = categoryGroup.category
      const formated_category = category?.replace(/_/g, " ").replace(/\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() +
                txt.substr(1).toLowerCase();
        })
      return [formated_category, Number.parseFloat(categoryGroup.amount)]
  }).filter(([_, amount]) => amount >= 0) : null;

  const chartEvents = [
    {
      eventName: "select",
      callback({ chartWrapper }) {
        const selection = chartWrapper.getChart().getSelection();
        if (selection.length > 0) {
          const rowIndex = selection[0].row;
          const transactionCategory = newData[rowIndex][0];
          const transactionAmount = newData[rowIndex][1];
          console.log("Selected Transaction:", transactionCategory, transactionAmount);
        }
      }
    }
  ]

  // console.log("New Data:", newData)

  return (
    <>
      <CustomCard sx={{ alignItems: 'center', justifyContent: 'center' }}> 
        <h1>Transactions</h1>
          <Chart
            chartType="PieChart"
            width="100%"
            height="500px"
            data={[["Category", "Amount"], ...newData]}
            options={options}
            chartEvents={chartEvents}
          />
      </CustomCard>
    </>
  )
}

export default TransactionChart