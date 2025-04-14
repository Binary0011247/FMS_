import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const DashboardScreen = () => {
  // Function to handle navigation to EMI & SIP Calculator screen
  const navigateToCalculator = () => {
    router.push('/calculator');
  };
  
  const navigateToLibrary = () => {
    router.push('/library');
  };
  
  const navigateToFundFlow = () => {
    router.push('/expense');
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Clear user data from AsyncStorage if needed
      await AsyncStorage.removeItem('userName');
      // Add any other user data you want to clear
      
      // Navigate to login screen
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  const [userName, setUserName] = useState('');
  
  // Data for financial insights - we'll store these in state and load from AsyncStorage
  const [monthlySpending, setMonthlySpending] = useState({
    current: 0,
    previous: 0,
    percentChange: 0
  });
  
  // State for top spending categories
  const [topCategories, setTopCategories] = useState([]);
  
  // State for budget info
  const [budget, setBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      // Get user name
      const name = await AsyncStorage.getItem('userName');
      setUserName(name || 'User');
      
      // Get expense data
      try {
        // Get transactions from AsyncStorage
        const transactionsJson = await AsyncStorage.getItem('transactions');
        const transactions = transactionsJson ? JSON.parse(transactionsJson) : [];
        
        // Get budget info
        const budgetValue = parseFloat(await AsyncStorage.getItem('budget') || '0');
        const incomeValue = parseFloat(await AsyncStorage.getItem('income') || '0');
        
        // Calculate total spent this month
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Filter transactions for current month
        const currentMonthTransactions = transactions.filter(transaction => {
          const transDate = new Date(transaction.date);
          return transDate.getMonth() === currentMonth && 
                 transDate.getFullYear() === currentYear;
        });
        
        // Calculate total spent this month
        const currentMonthTotal = currentMonthTransactions.reduce(
          (sum, transaction) => sum + transaction.amount, 0
        );
        
        // Filter transactions for previous month
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        
        const prevMonthTransactions = transactions.filter(transaction => {
          const transDate = new Date(transaction.date);
          return transDate.getMonth() === prevMonth && 
                 transDate.getFullYear() === prevYear;
        });
        
        // Calculate total spent previous month
        const prevMonthTotal = prevMonthTransactions.reduce(
          (sum, transaction) => sum + transaction.amount, 0
        );
        
        // Calculate percent change
        const percentChange = prevMonthTotal !== 0 
          ? ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100 
          : 0;
        
        // Set monthly spending state
        setMonthlySpending({
          current: currentMonthTotal,
          previous: prevMonthTotal,
          percentChange: percentChange
        });
        
        // Set budget info
        setBudget(budgetValue);
        setTotalSpent(currentMonthTotal);
        setRemainingBudget(budgetValue - currentMonthTotal);
        
        // Calculate top spending categories
        const categoryTotals = {};
        
        // Sum amounts by category
        currentMonthTransactions.forEach(transaction => {
          if (!categoryTotals[transaction.category]) {
            categoryTotals[transaction.category] = 0;
          }
          categoryTotals[transaction.category] += transaction.amount;
        });
        
        // Convert to array and sort
        const categoriesArray = Object.entries(categoryTotals).map(([name, amount]) => ({
          name,
          amount,
          percent: (amount / currentMonthTotal) * 100
        }));
        
        // Sort by amount (descending)
        categoriesArray.sort((a, b) => b.amount - a.amount);
        
        // Take top 3 categories
        setTopCategories(categoriesArray.slice(0, 3));
        
      } catch (error) {
        console.error('Error fetching expense data:', error);
        // Set defaults if there's an error
        setMonthlySpending({
          current: 0,
          previous: 0,
          percentChange: 0
        });
        setTopCategories([]);
      }
    };

    fetchUserData();
  }, []);

  // Category colors matching the expense tracker
  const categoryColors = {
    Food: '#FF6384',
    Transport: '#36A2EB',
    Shopping: '#FFCE56',
    Utilities: '#4BC0C0',
    Entertainment: '#9966FF',
    Health: '#FF9F40',
    Other: '#AAAAAA'
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Section - Fixed at the top */}
      <LinearGradient
        colors={['#67AE6E', '#00b392']}
        style={styles.headerContainer}
      >
        <View style={styles.headerTopRow}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image 
                source={require('D:/FMS Frontend/FMS/assets/images/User.png')} 
                style={styles.avatarImage} 
              />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerName}>Hi {userName}</Text>
              <Text style={styles.headerSubtitle}></Text>
            </View>
          </View>
          
          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Motivational Card */}
        <View style={styles.motivationalCard}>
          <Text style={styles.motivationalText}>       Manage Your Money Wisely</Text>
        </View>
      </LinearGradient>

      {/* Scrollable Main Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Feature Cards */}
        <View style={styles.featuresContainer}>
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={navigateToLibrary}
          >
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="bookshelf" size={28} color="#333" />
            </View>
            <Text style={styles.featureText}>Knowery</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={navigateToFundFlow}
          >
            <View style={styles.iconCircle}>
              <MaterialIcons name="trending-up" size={28} color="#333" />
            </View>
            <Text style={styles.featureText}>FundFlow</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureCard}
            onPress={navigateToCalculator}
          >
            <View style={styles.iconCircle}>
              <FontAwesome5 name="calculator" size={26} color="#333" />
            </View>
            <Text style={styles.featureText}>EMI & SIP Calculator</Text>
          </TouchableOpacity>
        </View>

        {/* Budget Status Card */}
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <MaterialIcons name="account-balance-wallet" size={24} color="#00b392" />
            <Text style={styles.insightTitle}>Budget Status</Text>
          </View>
          
          <View style={styles.budgetStatusContainer}>
            <View style={styles.budgetStatusRow}>
              <Text style={styles.budgetLabel}>Total Budget:</Text>
              <Text style={styles.budgetValue}>₹{budget.toLocaleString()}</Text>
            </View>
            
            <View style={styles.budgetStatusRow}>
              <Text style={styles.budgetLabel}>Spent:</Text>
              <Text style={styles.budgetValue}>₹{totalSpent.toLocaleString()}</Text>
            </View>
            
            <View style={styles.budgetStatusRow}>
              <Text style={styles.budgetLabel}>Remaining:</Text>
              <Text style={[
                styles.budgetValue, 
                remainingBudget < 0 ? styles.negativeAmount : styles.positiveAmount
              ]}>
                ₹{Math.abs(remainingBudget).toLocaleString()}
              </Text>
            </View>
            
            {/* Budget Progress Bar */}
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
        </View>

        {/* Financial Insights Section */}
        <View style={styles.insightsContainer}>
          <Text style={styles.sectionTitle}>Financial Insights</Text>
          
          {/* Monthly Spending Trends */}
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <MaterialIcons name="show-chart" size={24} color="#00b392" />
              <Text style={styles.insightTitle}>Monthly Spending Trends</Text>
            </View>
            <View style={styles.spendingTrendsContainer}>
              <View style={styles.spendingColumn}>
                <Text style={styles.spendingLabel}>Current Month</Text>
                <Text style={styles.spendingAmount}>₹{monthlySpending.current.toLocaleString()}</Text>
              </View>
              <View style={styles.spendingComparisonContainer}>
                {monthlySpending.percentChange < 0 ? (
                  <FontAwesome name="arrow-down" size={16} color="green" />
                ) : (
                  <FontAwesome name="arrow-up" size={16} color="red" />
                )}
                <Text 
                  style={[
                    styles.percentChangeText, 
                    {color: monthlySpending.percentChange < 0 ? 'green' : 'red'}
                  ]}
                >
                  {Math.abs(monthlySpending.percentChange).toFixed(1)}%
                </Text>
              </View>
              <View style={styles.spendingColumn}>
                <Text style={styles.spendingLabel}>Previous Month</Text>
                <Text style={styles.spendingAmount}>₹{monthlySpending.previous.toLocaleString()}</Text>
              </View>
            </View>
          </View>
          
          {/* Top Spending Categories */}
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <MaterialCommunityIcons name="finance" size={24} color="#00b392" />
              <Text style={styles.insightTitle}>Top Spending Categories</Text>
            </View>
            
            <View style={styles.categoryContainer}>
              {topCategories.length > 0 ? (
                topCategories.map((category, index) => (
                  <View key={index} style={styles.categoryItem}>
                    <View style={[
                      styles.categoryIcon, 
                      {backgroundColor: categoryColors[category.name] ? 
                        `${categoryColors[category.name]}20` : '#AAAAAA20'}
                    ]}>
                      <MaterialIcons 
                        name={getCategoryIcon(category.name)} 
                        size={16} 
                        color={categoryColors[category.name] || '#AAAAAA'} 
                      />
                    </View>
                    <View style={styles.categoryDetails}>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <View style={styles.categoryProgressContainer}>
                        <View 
                          style={[
                            styles.categoryProgressBar, 
                            { 
                              width: `${Math.min(100, category.percent)}%`,
                              backgroundColor: categoryColors[category.name] || '#AAAAAA'
                            }
                          ]} 
                        />
                      </View>
                    </View>
                    <Text style={styles.categoryAmount}>₹{category.amount.toLocaleString()}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>No spending data available</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper function to get appropriate icon for each category
const getCategoryIcon = (category) => {
  switch(category) {
    case 'Food': return 'fastfood';
    case 'Transport': return 'directions-car';
    case 'Shopping': return 'shopping-bag';
    case 'Utilities': return 'lightbulb';
    case 'Entertainment': return 'movie';
    case 'Health': return 'healing';
    default: return 'category';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Makes it circular
    resizeMode: 'cover',
  },
  headerTextContainer: {
    marginLeft: 15,
  },
  headerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  motivationalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 15,
    marginTop: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#fff',
  },
  motivationalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 30, // Extra padding at the bottom for better scrolling experience
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  featureCard: {
    width: '30%',
    backgroundColor: '#e8f8e8',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  insightsContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
  },
  // Budget status styles
  budgetStatusContainer: {
    marginVertical: 5,
  },
  budgetStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#666',
  },
  budgetValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  positiveAmount: {
    color: '#4CAF50',
  },
  negativeAmount: {
    color: '#F44336',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3470FF',
    borderRadius: 4,
  },
  overBudget: {
    backgroundColor: '#F44336',
  },
  // Spending trends styles
  spendingTrendsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  spendingColumn: {
    alignItems: 'center',
  },
  spendingLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  spendingAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  spendingComparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentChangeText: {
    marginLeft: 4,
    fontSize: 15,
    fontWeight: '600',
  },
  // Category analysis styles
  categoryContainer: {
    marginTop: 5,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  categoryProgressContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  categoryProgressBar: {
    height: '100%',
    borderRadius: 3,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    padding: 10,
  },
});

export default DashboardScreen;