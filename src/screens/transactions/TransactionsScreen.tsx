import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api/apiClient';

const TransactionsScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const filters = [
    { id: 'all', label: 'All', icon: 'list' },
    { id: 'data', label: 'Data', icon: 'wifi' },
    { id: 'airtime', label: 'Airtime', icon: 'phone-android' },
    { id: 'bills', label: 'Bills', icon: 'receipt' },
    { id: 'funding', label: 'Funding', icon: 'account-balance-wallet' },
  ];

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [selectedFilter, searchQuery, transactions]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/wallet/transactions');
      setTransactions(response.data.transactions);
      setFilteredTransactions(response.data.transactions);
    } catch (error) {
      // Mock data
      const mockTransactions = [
        { id: 1, type: 'data', network: 'MTN', amount: 300, status: 'success', date: '2024-04-15T16:30:00', reference: 'TXN001' },
        { id: 2, type: 'airtime', network: 'Glo', amount: 200, status: 'success', date: '2024-04-15T14:15:00', reference: 'TXN002' },
        { id: 3, type: 'bills', network: 'Electricity', amount: 5000, status: 'failed', date: '2024-04-14T10:00:00', reference: 'TXN003' },
        { id: 4, type: 'funding', amount: 10000, status: 'success', date: '2024-04-13T09:30:00', reference: 'TXN004' },
        { id: 5, type: 'data', network: 'Airtel', amount: 600, status: 'success', date: '2024-04-12T18:45:00', reference: 'TXN005' },
      ];
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];
    
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(tx => tx.type === selectedFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(tx => 
        tx.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.network?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredTransactions(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const groupByDate = () => {
    const groups: any = {};
    filteredTransactions.forEach(tx => {
      const date = new Date(tx.date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(tx);
    });
    return groups;
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'data': return 'wifi';
      case 'airtime': return 'phone-android';
      case 'bills': return 'receipt';
      case 'funding': return 'account-balance-wallet';
      default: return 'receipt';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'success' ? COLORS.success : COLORS.error;
  };

  const renderTransaction = ({ item }: any) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={[styles.transactionIcon, { backgroundColor: COLORS.primary + '10' }]}>
        <Icon name={getIcon(item.type)} size={24} color={COLORS.primary} />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>
          {item.type === 'data' && `${item.network} Data`}
          {item.type === 'airtime' && `${item.network} Airtime`}
          {item.type === 'bills' && `${item.network} Bill`}
          {item.type === 'funding' && 'Wallet Funding'}
        </Text>
        <Text style={styles.transactionDate}>
          {new Date(item.date).toLocaleTimeString()}
        </Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={[styles.amount, { color: item.type === 'funding' ? COLORS.success : COLORS.text.primary }]}>
          {item.type === 'funding' ? '+' : '-'}₦{item.amount}
        </Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {item.status === 'success' ? '✅ Success' : '❌ Failed'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const groupedTransactions = groupByDate();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity>
          <Icon name="filter-list" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={COLORS.text.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions"
          placeholderTextColor={COLORS.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedFilter === item.id && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(item.id)}
            >
              <Icon
                name={item.icon}
                size={16}
                color={selectedFilter === item.id ? COLORS.surface : COLORS.text.secondary}
              />
              <Text
                style={[
                  styles.filterLabel,
                  selectedFilter === item.id && styles.filterLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={Object.entries(groupedTransactions)}
        keyExtractor={([date]) => date}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item: [date, transactions] }) => (
          <View style={styles.dateSection}>
            <Text style={styles.dateHeader}>{date}</Text>
            {transactions.map((tx: any) => (
              <View key={tx.id}>
                {renderTransaction({ item: tx })}
              </View>
            ))}
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Icon name="receipt" size={80} color={COLORS.text.tertiary} />
            <Text style={styles.emptyTitle}>No Transactions</Text>
            <Text style={styles.emptyText}>
              Your transactions will appear here
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.xl,
    paddingBottom: SIZES.md,
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.heading,
    color: COLORS.text.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    margin: SIZES.lg,
    paddingHorizontal: SIZES.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.sm,
    fontSize: 16,
    fontFamily: FONTS.body,
    color: COLORS.text.primary,
  },
  filtersContainer: {
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 20,
    marginRight: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterLabel: {
    marginLeft: SIZES.xs,
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
  },
  filterLabelActive: {
    color: COLORS.surface,
  },
  dateSection: {
    marginBottom: SIZES.md,
  },
  dateHeader: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    fontSize: 14,
    fontFamily: FONTS.bodyBold,
    color: COLORS.text.secondary,
    backgroundColor: COLORS.background,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.md,
    marginHorizontal: SIZES.lg,
    marginBottom: SIZES.sm,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.text.primary,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontFamily: FONTS.bodyBold,
  },
  status: {
    fontSize: 12,
    fontFamily: FONTS.body,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xxxl * 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: FONTS.heading,
    color: COLORS.text.primary,
    marginTop: SIZES.md,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: COLORS.text.secondary,
    marginTop: SIZES.xs,
  },
});

export default TransactionsScreen;