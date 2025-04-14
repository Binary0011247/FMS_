import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  StatusBar,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { router } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
// USD to INR conversion rate
const USD_TO_INR = 83.32; // as of March 31, 2025 (hypothetical)

const ExpenseTracker = ({ navigation }) => {
  // State for transactions
  const [transactions, setTransactions] = useState([
    { id: '1', date: '2025-03-29', category: 'Food', amount: 25.50 * USD_TO_INR, merchant: 'Grocery Store' },
    { id: '2', date: '2025-03-28', category: 'Transport', amount: 15.00 * USD_TO_INR, merchant: 'Uber' },
    { id: '3', date: '2025-03-27', category: 'Shopping', amount: 120.75 * USD_TO_INR, merchant: 'Amazon' },
    { id: '4', date: '2025-03-26', category: 'Utilities', amount: 85.30 * USD_TO_INR, merchant: 'Electric Company' },
    { id: '5', date: '2025-03-25', category: 'Entertainment', amount: 45.00 * USD_TO_INR, merchant: 'Cinema' },
    { id: '6', date: '2025-03-24', category: 'Health', amount: 30.00 * USD_TO_INR, merchant: 'Pharmacy' },
  ]);
  
  // State for expense modal
  const [modalVisible, setModalVisible] = useState(false);
  const [newExpense, setNewExpense] = useState({
    merchant: '',
    amount: '',
    category: 'Food',
  });

  // State for budget editing
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [income, setIncome] = useState(1500 * USD_TO_INR); // Default monthly income
  const [tempIncome, setTempIncome] = useState('');

  const navigateToDashboard = () => {
    router.back();
  };

  // State for budget (converted to INR)
  const [budget, setBudget] = useState(1000 * USD_TO_INR);
  const [totalSpent, setTotalSpent] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Category colors
  const categoryColors = {
    Food: '#FF6384',
    Transport: '#36A2EB',
    Shopping: '#FFCE56',
    Utilities: '#4BC0C0',
    Entertainment: '#9966FF',
    Health: '#FF9F40',
  };

  // Load data from AsyncStorage when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load transactions
        const savedTransactions = await AsyncStorage.getItem('transactions');
        if (savedTransactions) {
          setTransactions(JSON.parse(savedTransactions));
        }
        
        // Load income and budget
        const savedIncome = await AsyncStorage.getItem('income');
        if (savedIncome) {
          setIncome(parseFloat(savedIncome));
        }
        
        const savedBudget = await AsyncStorage.getItem('budget');
        if (savedBudget) {
          setBudget(parseFloat(savedBudget));
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };
    
    loadData();
  }, []);

  // Calculate total spent
  useEffect(() => {
    const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    setTotalSpent(total);
  }, [transactions]);

  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
        await AsyncStorage.setItem('income', income.toString());
        await AsyncStorage.setItem('budget', budget.toString());
      } catch (error) {
        console.error('Error saving data to AsyncStorage:', error);
      }
    };
    
    saveData();
  }, [transactions, income, budget]);

  // Chart data
  const pieChartData = Object.entries(
    transactions.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    }, {})
  ).map(([name, amount]) => ({
    name,
    amount,
    color: categoryColors[name] || '#000000',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  // Filter transactions based on search and category
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeFilter === 'All' || transaction.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  // Add new transaction
  const addTransaction = () => {
    setModalVisible(true);
  };

  // Open budget edit modal
  const openBudgetModal = () => {
    setTempIncome(income.toString());
    setBudgetModalVisible(true);
  };

  // Handle saving new budget
  const handleSaveBudget = () => {
    if (tempIncome && !isNaN(parseFloat(tempIncome))) {
      const newIncome = parseFloat(tempIncome);
      setIncome(newIncome);
      setBudget(newIncome * 0.7); // Set budget to 70% of income as an example
      
      // Save to AsyncStorage
      AsyncStorage.setItem('income', newIncome.toString());
      AsyncStorage.setItem('budget', (newIncome * 0.7).toString());
    }
    setBudgetModalVisible(false);
  };

  // Handle saving new expense
  const handleSaveExpense = () => {
    // Validate inputs
    if (!newExpense.merchant || !newExpense.amount) {
      alert('Please fill all required fields');
      return;
    }

    // Create new transaction object
    const newTransaction = {
      id: (transactions.length + 1).toString(),
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      merchant: newExpense.merchant,
    };

    // Add to transactions list
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    
    // Save to AsyncStorage
    AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    
    // Reset form and close modal
    setNewExpense({
      merchant: '',
      amount: '',
      category: 'Food',
    });
    setModalVisible(false);
  };

  // Handle category selection in the modal
  const handleCategorySelect = (category) => {
    setNewExpense({...newExpense, category});
  };
  
  const generatePdfContent = () => {
    const date = new Date().toLocaleDateString();
    
    // Create category summary
    const categorySummary = Object.entries(
      transactions.reduce((acc, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0;
        }
        acc[transaction.category] += transaction.amount;
        return acc;
      }, {})
    );
    
    // Create HTML for PDF
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: 'Helvetica', sans-serif;
              padding: 20px;
              color: #333;
            }
            h1 {
              color: #3470FF;
              text-align: center;
              margin-bottom: 30px;
            }
            .summary {
              background-color: #f9f9f9;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .summary h2 {
              margin-top: 0;
              color: #3470FF;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
            th {
              background-color: #3470FF;
              color: white;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .category-table {
              margin-top: 30px;
              margin-bottom: 30px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <h1>Expense Report</h1>
          
          <div class="summary">
            <h2>Summary</h2>
            <p><strong>Date Generated:</strong> ${date}</p>
            <p><strong>Monthly Income:</strong> ₹${income.toFixed(2)}</p>
            <p><strong>Monthly Budget:</strong> ₹${budget.toFixed(2)}</p>
            <p><strong>Total Spent:</strong> ₹${totalSpent.toFixed(2)}</p>
            <p><strong>Remaining Budget:</strong> ₹${(budget - totalSpent).toFixed(2)}</p>
          </div>
          
          <h2>Category Breakdown</h2>
          <table class="category-table">
            <tr>
              <th>Category</th>
              <th>Amount (₹)</th>
              <th>Percentage</th>
            </tr>
            ${categorySummary.map(([category, amount]) => `
              <tr>
                <td>${category}</td>
                <td>₹${amount.toFixed(2)}</td>
                <td>${((amount / totalSpent) * 100).toFixed(1)}%</td>
              </tr>
            `).join('')}
          </table>
          
          <h2>Transaction Details</h2>
          <table>
            <tr>
              <th>Date</th>
              <th>Merchant</th>
              <th>Category</th>
              <th>Amount (₹)</th>
            </tr>
            ${transactions.map(transaction => `
              <tr>
                <td>${transaction.date}</td>
                <td>${transaction.merchant}</td>
                <td>${transaction.category}</td>
                <td>₹${transaction.amount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </table>
          
          <div class="footer">
            <p>Generated by Expense Tracker App on ${date}</p>
          </div>
        </body>
      </html>
    `;
  };

  // Export expenses as PDF
  const exportExpensesAsPdf = async () => {
    try {
      // Generate HTML content for PDF
      const htmlContent = generatePdfContent();
      
      // Generate PDF file using expo-print
      const { uri } = await Print.printToFileAsync({ 
        html: htmlContent,
        base64: false
      });
      
      // Create a more user-friendly filename
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      const pdfName = `expenses_${formattedDate}.pdf`;
      const pdfPath = `${FileSystem.documentDirectory}${pdfName}`;
      
      // Copy the file to the document directory with a better name
      await FileSystem.copyAsync({
        from: uri,
        to: pdfPath
      });
      
      // Check if sharing is available
      if (await Sharing.isAvailableAsync()) {
        // Share the PDF file
        await Sharing.shareAsync(pdfPath, {
          UTI: '.pdf',
          mimeType: 'application/pdf'
        });
        Alert.alert("Success", "Your expense report has been exported successfully!");
      } else {
        Alert.alert("Error", "Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      Alert.alert("Error", "Failed to export expenses. Please try again.");
    }
  };



  // Render a transaction item
  const renderTransaction = ({ item }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => alert(`Edit transaction: ${item.merchant}`)}
    >
      <View style={[styles.categoryIndicator, { backgroundColor: categoryColors[item.category] }]} />
      <View style={styles.transactionDetails}>
        <Text style={styles.merchantName}>{item.merchant}</Text>
        <Text style={styles.transactionCategory}>{item.category}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text style={styles.transactionAmount}>-₹{item.amount.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={navigateToDashboard}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expense Tracker</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Income Summary */}
        <View style={styles.incomeCard}>
          <View style={styles.incomeHeader}>
            <Text style={styles.incomeTitle}>Monthly Income</Text>
          </View>
          <Text style={styles.incomeAmount}>₹{income.toFixed(2)}</Text>
        </View>
        
        {/* Budget Summary */}
        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetTitle}>Monthly Budget</Text>
            <TouchableOpacity onPress={openBudgetModal}>
              <Text style={styles.editBudget}>Edit</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.budgetInfo}>
            <Text style={styles.spentAmount}>₹{totalSpent.toFixed(2)} spent</Text>
            <Text style={styles.remainingAmount}>₹{(budget - totalSpent).toFixed(2)} remaining</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${Math.min(100, (totalSpent / budget) * 100)}%` },
                totalSpent > budget && styles.overBudget
              ]} 
            />
          </View>
        </View>

        {/* Quick Add Button */}
        <TouchableOpacity style={styles.quickAddButton} onPress={addTransaction}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.quickAddText}>Add Expense</Text>
        </TouchableOpacity>

        {/* Category Spending */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Spending by Category</Text>
          <View style={styles.pieChartContainer}>
            <PieChart
              data={pieChartData}
              width={screenWidth - 40}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {['All', ...Object.keys(categoryColors)].map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterButton,
                activeFilter === category && styles.activeFilter,
                category !== 'All' && { backgroundColor: categoryColors[category] + '20' } // Light version of the color
              ]}
              onPress={() => setActiveFilter(category)}
            >
              <Text 
                style={[
                  styles.filterText,
                  activeFilter === category && styles.activeFilterText,
                  category !== 'All' && { color: categoryColors[category] }
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransaction}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            style={styles.transactionsList}
          />
        </View>

        {/* Quick Actions */}
        <TouchableOpacity 
          style={styles.exportButtonContainer}
          onPress={exportExpensesAsPdf}
        >
          
          
            <Ionicons name="download-outline" size={24} marginLeft="165" color="black" />
            <Text style={styles.exportText}>Export Expenses as PDF</Text>
          
        </TouchableOpacity>
      </ScrollView>

      {/* Add Expense Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Expense</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Merchant</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Where did you spend?"
                value={newExpense.merchant}
                onChangeText={(text) => setNewExpense({...newExpense, merchant: text})}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Amount (₹)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="How much did you spend?"
                keyboardType="numeric"
                value={newExpense.amount}
                onChangeText={(text) => {
                  // Only allow numbers and decimal point
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(text) || text === '') {
                    setNewExpense({...newExpense, amount: text});
                  }
                }}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Category</Text>
              <View style={styles.categorySelector}>
                {Object.keys(categoryColors).map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categorySelectorItem,
                      newExpense.category === category && {
                        backgroundColor: categoryColors[category] + '30',
                        borderColor: categoryColors[category],
                      },
                    ]}
                    onPress={() => handleCategorySelect(category)}
                  >
                    <View 
                      style={[
                        styles.categoryIndicator, 
                        { backgroundColor: categoryColors[category] }
                      ]} 
                    />
                    <Text style={styles.categoryText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveExpense}>
              <Text style={styles.saveButtonText}>Save Expense</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Budget Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={budgetModalVisible}
        onRequestClose={() => {
          setBudgetModalVisible(false);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Monthly Income</Text>
              <TouchableOpacity onPress={() => setBudgetModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Total Monthly Income (₹)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter your monthly income"
                keyboardType="numeric"
                value={tempIncome}
                onChangeText={(text) => {
                  // Only allow numbers and decimal point
                  const regex = /^\d*\.?\d*$/;
                  if (regex.test(text) || text === '') {
                    setTempIncome(text);
                  }
                }}
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveBudget}>
              <Text style={styles.saveButtonText}>Save Income</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsButton: {
    padding: 8,
  },
  incomeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  incomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  incomeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  incomeAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  budgetCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  editBudget: {
    fontSize: 14,
    color: '#3470FF',
  },
  budgetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  spentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  remainingAmount: {
    fontSize: 16,
    color: '#3470FF',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3470FF',
    borderRadius: 4,
  },
  overBudget: {
    backgroundColor: '#FF3B30',
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3470FF',
    borderRadius: 12,
    margin: 16,
    marginTop: 0,
    padding: 16,
    shadowColor: '#3470FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  quickAddText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    marginTop: 0,
    paddingHorizontal: 16,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  activeFilter: {
    backgroundColor: '#3470FF',
  },
  filterText: {
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  transactionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3470FF',
  },
  transactionsList: {
    marginBottom: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  transactionCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    marginTop: 0,
    marginBottom: 32,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categorySelectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    margin: 4,
    width: '45%',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#3470FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  shareIconImage: {
    width: 24,
    height: 24,
    tintColor: 'black',
    marginBottom: 8,
  },
  exportText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 90,
  },
});

export default ExpenseTracker;