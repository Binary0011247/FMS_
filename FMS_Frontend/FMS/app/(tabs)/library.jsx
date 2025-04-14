import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StatusBar,
  Animated 
} from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const LibraryScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedArticle, setExpandedArticle] = useState(null);

  const articles = [
    {
      id: 1,
      title: 'Understanding Different Bank Accounts',
      description: 'Learn about savings, checking, and money market accounts to make the best choice for your needs.',
      content: 'Savings accounts are ideal for storing money safely while earning modest interest. These accounts usually limit the number of withdrawals you can make each month, encouraging disciplined saving. Checking accounts are best suited for daily transactions and bill payments. They offer unlimited access to funds but generally earn little or no interest,Money market accounts combine features of savings and checking accounts. They offer higher interest rates compared to savings accounts, but often require a higher minimum balance and may limit withdrawals. Choosing the right account depends on how frequently you access your funds and whether you want to earn interest. For daily use, go with a checking account. For short- to medium-term savings, a savings or money market account might be a better fit.',
      category: 'banking',
      readTime: '5 min',
      image: require('D:/FMS Frontend/FMS/assets/images/bank-accounts.png'),
    },
    {
      id: 2,
      title: 'Investment 101: Getting Started',
      description: 'A beginners guide to investments, covering stocks, bonds, mutual funds, and ETFs.',
      content: `Investing is one of the most effective ways to grow your wealth over time. Stocks represent ownership in a company and offer high growth potential, though they come with risks. Bonds are safer, offering fixed returns as you lend money to corporations or governments. 
  
  Mutual funds pool money from multiple investors to buy a diversified set of assets managed by professionals. ETFs, or Exchange-Traded Funds, also offer diversification but are traded like stocks on the market, often with lower fees than mutual funds.
  
  To get started, assess your risk tolerance and financial goals. Consider investing in a diversified portfolio with a mix of asset classes. Use tools like SIPs (Systematic Investment Plans) to invest small amounts regularly. Most importantly, start early and stay invested for the long term.`,
      category: 'investment',
      readTime: '7 min',
      image: require('D:/FMS Frontend/FMS/assets/images/Investment.png'),
      featured: true,
    },
    {
      id: 3,
      title: 'Budgeting Basics',
      description: 'Learn how to create a budget, track your spending, and save effectively.',
      content: `Creating a budget starts with understanding how much money you bring in and where it goes. List your sources of income and all monthly expenses including rent, groceries, transport, and subscriptions. Categorize these expenses into needs, wants, and savings.A popular method is the 50/30/20 rule: 50% for essentials, 30% for discretionary spending, and 20% for savings and debt repayment. Track your spending using apps or spreadsheets to identify patterns and areas for improvement.Revisit your budget monthly to adapt to any changes in income or expenses. Set achievable financial goals such as building an emergency fund, paying off debt, or saving for a trip. Budgeting gives you control over your money and peace of mind`,
      category: 'banking',
      readTime: '6 min',
      image: require('D:/FMS Frontend/FMS/assets/images/Compund interest.png'),
    },
    {
      id: 4,
      title: 'Credit Score Explained',
      description: 'Understand what affects your credit score and how to improve it.',
      content: `A credit score is a 3-digit number that reflects your creditworthiness. It's calculated based on five key factors: payment history (35%), amounts owed (30%), length of credit history (15%), new credit (10%), and credit mix (10%).
  
  To improve your score, always pay your bills on time — even one missed payment can hurt your score. Keep your credit utilization ratio low — ideally under 30% of your total limit. Avoid opening too many accounts in a short time. Keep older accounts open to maintain a longer credit history.
  
  A good credit score opens doors to better interest rates on loans, higher chances of approval, and more financial freedom. Monitor your credit reports regularly for errors and disputes, and be consistent with responsible usage.`,
      category: 'banking',
      readTime: '4 min',
      image: require('D:/FMS Frontend/FMS/assets/images/Credit score.png'),
    },
    {
      id: 5,
      title: 'Retirement Planning Tips',
      description: 'Its never too early to plan for retirement. Learn the basics now.',
      content: `Retirement planning involves setting aside enough money to maintain your lifestyle after you stop working. Start by estimating your retirement expenses — housing, healthcare, travel, etc. Then calculate how much you need to save monthly to meet that goal.
  
  Use accounts like EPF, PPF, NPS, and pension plans that offer tax benefits and compound interest. Begin early — the sooner you start, the more your money grows through compounding. 
  
  Diversify your investments across equity, debt, and fixed-income instruments depending on your risk appetite and age. As you get closer to retirement, shift your portfolio towards lower-risk options. Regularly review your plan and increase contributions as your income grows.
  
  Retirement is not just about money — it's about freedom and peace of mind.`,
      category: 'investment',
      readTime: '6 min',
      image: require('D:/FMS Frontend/FMS/assets/images/emergency fund.png'),
      featured: true,
    },
    // other articles
  ];

  const toggleArticleExpansion = (articleId) => {
    if (expandedArticle === articleId) {
      setExpandedArticle(null); // Collapse if already expanded
    } else {
      setExpandedArticle(articleId); // Expand the selected article
    }
  };

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const featuredArticles = articles.filter(article => article.featured);

  const renderArticle = (article) => {
    const isExpanded = expandedArticle === article.id;
    
    return (
      <TouchableOpacity 
        key={article.id}
        style={[styles.articleCard, isExpanded && styles.expandedArticleCard]}
        onPress={() => toggleArticleExpansion(article.id)}
        activeOpacity={0.9}
      >
        {!isExpanded ? (
          // Collapsed view (similar to original)
          <>
            <Image source={article.image} style={styles.articleImage} resizeMode="cover" />
            <View style={styles.articleContent}>
              <View style={styles.articleMeta}>
                <View style={[styles.categoryBadge, { backgroundColor: article.category === 'banking' ? '#e0f7fa' : '#e8f5e9' }]}>
                  <Text style={[styles.categoryBadgeText, { color: article.category === 'banking' ? '#0097a7' : '#2e7d32' }]}>
                    {article.category === 'banking' ? 'Banking' : 'Investment'}
                  </Text>
                </View>
                <Text style={styles.readTime}>
                  <Ionicons name="time-outline" size={12} color="#666" /> {' ' + article.readTime}
                </Text>
              </View>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleDescription} numberOfLines={2}>{article.description}</Text>
            </View>
          </>
        ) : (
          // Expanded view
          <View style={styles.expandedArticleContent}>
            <Image source={article.image} style={styles.expandedArticleImage} resizeMode="cover" />
            <View style={styles.expandedArticleHeader}>
              <View style={[styles.categoryBadge, { backgroundColor: article.category === 'banking' ? '#e0f7fa' : '#e8f5e9' }]}>
                <Text style={[styles.categoryBadgeText, { color: article.category === 'banking' ? '#0097a7' : '#2e7d32' }]}>
                  {article.category === 'banking' ? 'Banking' : 'Investment'}
                </Text>
              </View>
              <Text style={styles.readTime}>
                <Ionicons name="time-outline" size={12} color="#666" /> {' ' + article.readTime}
              </Text>
            </View>
            <Text style={styles.expandedArticleTitle}>{article.title}</Text>
            <Text style={styles.expandedArticleDescription}>{article.description}</Text>
            <Text style={styles.expandedArticleBody}>{article.content}</Text>
            <View style={styles.closeArticleContainer}>
              <Text style={styles.closeArticleText}>Tap to close</Text>
              <MaterialIcons name="keyboard-arrow-up" size={16} color="#666" />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={['#00d4a8', '#00b392']}
        style={styles.headerContainer}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Knowery</Text>
            <Text style={styles.headerSubtitle}>Your financial knowledge hub</Text>
          </View>
        </View>
        <View style={styles.waveContainer}>
          <View style={styles.wave} />
          <View style={[styles.wave, styles.wave2]} />
        </View>
      </LinearGradient>

      <View style={styles.categoryContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollView}
        >
          {['all', 'banking', 'investment'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryTab, selectedCategory === cat && styles.selectedCategoryTab]}
              onPress={() => setSelectedCategory(cat)}
            >
              {cat === 'banking' && <FontAwesome5 name="university" size={14} color={selectedCategory === cat ? '#00b392' : '#666'} />}
              {cat === 'investment' && <MaterialIcons name="trending-up" size={16} color={selectedCategory === cat ? '#00b392' : '#666'} />}
              <Text style={[styles.categoryText, selectedCategory === cat && styles.selectedCategoryText]}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {selectedCategory === 'all' && expandedArticle === null && (
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Featured Articles</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredScrollView}
            >
              {featuredArticles.map(article => (
                <TouchableOpacity 
                  key={article.id}
                  style={styles.featuredCard}
                  onPress={() => toggleArticleExpansion(article.id)}
                >
                  <Image source={article.image} style={styles.featuredImage} resizeMode="cover" />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.featuredGradient}
                  >
                    <View style={styles.featuredContent}>
                      <View style={styles.featuredCategory}>
                        <Text style={styles.featuredCategoryText}>{article.category === 'banking' ? 'Banking' : 'Investment'}</Text>
                      </View>
                      <Text style={styles.featuredTitle}>{article.title}</Text>
                      <Text style={styles.featuredReadTime}>{article.readTime} read</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.articlesSection}>
          {expandedArticle === null && (
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'all' ? 'All Articles' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Articles`}
            </Text>
          )}

          {filteredArticles.map(article => 
            expandedArticle === null || expandedArticle === article.id 
              ? renderArticle(article) 
              : null
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  waveContainer: {
    height: 30,
    position: 'relative',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  wave2: {
    right: '35%',
    left: '35%',
    bottom: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    zIndex: -1,
  },
  categoryContainer: {
    paddingVertical: 10,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 10,
  },
  categoriesScrollView: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedCategoryTab: {
    backgroundColor: '#e0f7f5',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 4,
  },
  selectedCategoryText: {
    color: '#00b392',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  featuredSection: {
    marginBottom: 20,
  },
  featuredScrollView: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  featuredCard: {
    width: 280,
    height: 180,
    borderRadius: 12,
    marginRight: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
    padding: 16,
    justifyContent: 'flex-end',
  },
  featuredContent: {
    width: '100%',
  },
  featuredCategory: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  featuredCategoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featuredReadTime: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  articlesSection: {
    paddingBottom: 20,
  },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    height: 120,
  },
  expandedArticleCard: {
    flexDirection: 'column',
    height: 'auto',
    marginTop: 16,
    marginBottom: 16,
  },
  articleImage: {
    width: 100,
    height: '100%',
  },
  articleContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  readTime: {
    fontSize: 12,
    color: '#666',
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  articleDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  // Expanded article styles
  expandedArticleContent: {
    width: '100%',
    padding: 0,
  },
  expandedArticleImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  expandedArticleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  expandedArticleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  expandedArticleDescription: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  expandedArticleBody: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  closeArticleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  closeArticleText: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
});

export default LibraryScreen;