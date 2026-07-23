import React, { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AmountModal } from '../components/AmountModal';
import { colors, fonts } from '../constants/theme';

import { appBackground } from '../data/assets';

import { useFarm } from '../data/FarmContext';

import type { StockStatus } from '../data/farm';
import { useAdaptive } from '../hooks/useAdaptive';

type InventoryItemDetailScreenProps = {
  itemId: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

type StockMode = 'add' | 'use' | null;

export function InventoryItemDetailScreen({
  itemId,
  onBack,
  onEdit,
  onDelete,
}: InventoryItemDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptive();
  const { getInventoryItem, addStock, useStock, removeInventoryItem } =
    useFarm();
  const item = getInventoryItem(itemId);
  const [stockMode, setStockMode] = useState<StockMode>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (!item) {
    return (
      <View style={styles.InventoryItemDetailScreenMissingEnclave}>
        <Text style={styles.InventoryItemDetailScreenMissingFiligree}>
          Item not found
        </Text>
        <Pressable onPress={onBack}>
          <Text style={styles.InventoryItemDetailScreenNavLinkFiligree}>
            ‹ Inventory
          </Text>
        </Pressable>
      </View>
    );
  }

  const rows = [
    { label: 'Current Quantity', value: item.quantityLabel },
    { label: 'Minimum Level', value: `${item.minQuantity} ${item.unit}` },
    { label: 'Unit Cost', value: item.unitCostLabel },
    { label: 'Total Value', value: item.totalValueLabel },
    { label: 'Supplier', value: item.supplier },
    { label: 'Purchase Date', value: item.purchaseDate },
  ];

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <ImageBackground
      source={appBackground}
      style={styles.InventoryItemDetailScreenFacetChassis}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.InventoryItemDetailScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalScale(6),
            paddingBottom: insets.bottom + adaptive.verticalScale(28),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.InventoryItemDetailScreenHeaderRowLintel}>
          <Pressable
            onPress={onBack}
            hitSlop={12}
            style={styles.InventoryItemDetailScreenNavSide}
          >
            <Text style={styles.InventoryItemDetailScreenNavLinkFiligree}>
              ‹ Inventory
            </Text>
          </Pressable>
          <Text style={styles.InventoryItemDetailScreenTitleFiligree}>
            Item
          </Text>
          <Pressable
            onPress={onEdit}
            hitSlop={12}
            style={styles.InventoryItemDetailScreenNavSideRight}
          >
            <Text style={styles.InventoryItemDetailScreenNavLinkBoldFiligree}>
              Edit
            </Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: adaptive.horizontalPadding }}>
          <View style={styles.InventoryItemDetailScreenIdentityRowLintel}>
            <View style={styles.InventoryItemDetailScreenFlexEnclave}>
              <Text style={styles.InventoryItemDetailScreenItemName}>
                {item.name}
              </Text>
              <Text style={styles.InventoryItemDetailScreenItemCategory}>
                {item.category}
              </Text>
            </View>
            <StatusChip status={item.status} />
          </View>

          <View style={styles.InventoryItemDetailScreenKvList}>
            {rows.map((row, index) => (
              <View
                key={row.label}
                style={[
                  styles.InventoryItemDetailScreenKvRow,
                  index < rows.length - 1 &&
                    styles.InventoryItemDetailScreenKvRowBorder,
                ]}
              >
                <Text style={styles.InventoryItemDetailScreenKvLabel}>
                  {row.label}
                </Text>
                <Text style={styles.InventoryItemDetailScreenKvValue}>
                  {row.value}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.InventoryItemDetailScreenActionRow}>
            <Pressable
              onPress={() => setStockMode('add')}
              style={({ pressed }) => [
                styles.InventoryItemDetailScreenAddStockBtn,
                pressed && styles.InventoryItemDetailScreenPressedDim,
              ]}
            >
              <Text style={styles.InventoryItemDetailScreenAddStockLabel}>
                + Add Stock
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setStockMode('use')}
              style={({ pressed }) => [
                styles.InventoryItemDetailScreenUseStockBtn,
                pressed && styles.InventoryItemDetailScreenPressedDim,
              ]}
            >
              <Text style={styles.InventoryItemDetailScreenUseStockLabel}>
                − Use Stock
              </Text>
            </Pressable>
          </View>

          <Text style={styles.InventoryItemDetailScreenSectionTitleFiligree}>
            Stock Movement
          </Text>
          <View style={styles.InventoryItemDetailScreenMovementList}>
            {item.movements.map((move, index) => (
              <View
                key={move.id}
                style={[
                  styles.InventoryItemDetailScreenMovementRow,
                  index < item.movements.length - 1 &&
                    styles.InventoryItemDetailScreenKvRowBorder,
                ]}
              >
                <View style={styles.InventoryItemDetailScreenFlexEnclave}>
                  <Text style={styles.InventoryItemDetailScreenMovementTitle}>
                    {move.title}
                  </Text>
                  {move.date ? (
                    <Text style={styles.InventoryItemDetailScreenMovementDate}>
                      {move.date}
                    </Text>
                  ) : null}
                </View>
                <Text
                  style={[
                    styles.InventoryItemDetailScreenMovementAmount,
                    move.kind === 'in' &&
                      styles.InventoryItemDetailScreenAmountIn,
                    move.kind === 'out' &&
                      styles.InventoryItemDetailScreenAmountOut,
                    move.kind === 'balance' &&
                      styles.InventoryItemDetailScreenAmountBalance,
                  ]}
                >
                  {move.amountLabel}
                </Text>
              </View>
            ))}
          </View>

          {item.alert ? (
            <View style={styles.InventoryItemDetailScreenAlertCard}>
              <Text style={styles.InventoryItemDetailScreenAlertLabel}>
                Alert
              </Text>
              <Text style={styles.InventoryItemDetailScreenAlertText}>
                {item.alert}
              </Text>
            </View>
          ) : null}

          <Pressable
            onPress={() => {
              removeInventoryItem(itemId);
              onDelete();
            }}
            style={styles.InventoryItemDetailScreenDeleteBtn}
          >
            <Text style={styles.InventoryItemDetailScreenDeleteLabel}>
              Delete Item
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {toast ? (
        <View
          style={[
            styles.InventoryItemDetailScreenToastChassis,
            { bottom: insets.bottom + adaptive.verticalScale(24) },
          ]}
        >
          <Text style={styles.InventoryItemDetailScreenToastFiligree}>
            {toast}
          </Text>
        </View>
      ) : null}

      <AmountModal
        visible={stockMode === 'add'}
        title="Add Stock"
        subtitle={item.name}
        unitLabel={item.unit}
        placeholder="e.g. 10"
        confirmLabel="Add Stock"
        onCancel={() => setStockMode(null)}
        onConfirm={amount => {
          addStock(itemId, amount);
          setStockMode(null);
          showToast(`Added ${amount} ${item.unit}`);
        }}
      />
      <AmountModal
        visible={stockMode === 'use'}
        title="Use Stock"
        subtitle={`Available: ${item.quantityLabel}`}
        unitLabel={item.unit}
        placeholder="e.g. 2"
        confirmLabel="Use Stock"
        onCancel={() => setStockMode(null)}
        onConfirm={amount => {
          const ok = useStock(itemId, amount);
          setStockMode(null);
          showToast(ok ? `Used ${amount} ${item.unit}` : 'Not enough stock');
        }}
      />
    </ImageBackground>
  );
}

function StatusChip({ status }: { status: StockStatus }) {
  const color =
    status === 'Available'
      ? colors.success
      : status === 'Low Stock'
      ? colors.priorityHigh
      : colors.danger;
  const bg =
    status === 'Available'
      ? colors.successSoft
      : status === 'Low Stock'
      ? colors.prioritySoft
      : colors.dangerSoft;

  return (
    <View
      style={[
        styles.InventoryItemDetailScreenStatusChip,
        { backgroundColor: bg },
      ]}
    >
      <Text
        style={[styles.InventoryItemDetailScreenStatusChipLabel, { color }]}
      >
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  InventoryItemDetailScreenFacetChassis: {
    backgroundColor: colors.background,
    flex: 1,
  },
  InventoryItemDetailScreenMissingEnclave: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },

  InventoryItemDetailScreenMissingFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 18,
    marginBottom: 12,
  },

  InventoryItemDetailScreenScrollContent: { flexGrow: 1 },
  InventoryItemDetailScreenHeaderRowLintel: {
    alignItems: 'center',
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  InventoryItemDetailScreenNavSide: { minWidth: 90 },
  InventoryItemDetailScreenNavSideRight: {
    alignItems: 'flex-end',
    minWidth: 90,
  },
  InventoryItemDetailScreenNavLinkFiligree: {
    color: colors.gold,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
  },

  InventoryItemDetailScreenNavLinkBoldFiligree: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
  },

  InventoryItemDetailScreenTitleFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },

  InventoryItemDetailScreenIdentityRowLintel: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  InventoryItemDetailScreenFlexEnclave: { flex: 1 },
  InventoryItemDetailScreenItemName: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 22,
    fontWeight: '700',
  },

  InventoryItemDetailScreenItemCategory: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    marginTop: 4,
  },

  InventoryItemDetailScreenStatusChip: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  InventoryItemDetailScreenStatusChipLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    fontWeight: '700',
  },
  InventoryItemDetailScreenKvList: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    overflow: 'hidden',
  },
  InventoryItemDetailScreenKvRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 38,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  InventoryItemDetailScreenKvRowBorder: {
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
  },
  InventoryItemDetailScreenKvLabel: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
  },
  InventoryItemDetailScreenKvValue: {
    color: colors.cream,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    textAlign: 'right',
  },

  InventoryItemDetailScreenActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },

  InventoryItemDetailScreenAddStockBtn: {
    alignItems: 'center',
    backgroundColor: colors.successButton,
    borderRadius: 14,
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },
  InventoryItemDetailScreenAddStockLabel: {
    color: colors.successButtonDark,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
  InventoryItemDetailScreenUseStockBtn: {
    alignItems: 'center',
    backgroundColor: colors.backButton,
    borderColor: colors.backButtonBorder,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },

  InventoryItemDetailScreenUseStockLabel: {
    color: colors.priorityHigh,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },

  InventoryItemDetailScreenPressedDim: { opacity: 0.88 },
  InventoryItemDetailScreenSectionTitleFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },

  InventoryItemDetailScreenMovementList: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  InventoryItemDetailScreenMovementRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 53,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  InventoryItemDetailScreenMovementTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },

  InventoryItemDetailScreenMovementDate: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    marginTop: 2,
  },
  InventoryItemDetailScreenMovementAmount: {
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },

  InventoryItemDetailScreenAmountIn: { color: colors.success },
  InventoryItemDetailScreenAmountOut: { color: colors.expenseMoney },

  InventoryItemDetailScreenAmountBalance: { color: colors.cream },

  InventoryItemDetailScreenAlertCard: {
    backgroundColor: colors.dangerSoftStrong,
    borderColor: colors.dangerBorder,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  InventoryItemDetailScreenAlertLabel: {
    color: colors.danger,
    fontFamily: fonts.sansBold,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  InventoryItemDetailScreenAlertText: {
    color: colors.bodySoft,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    lineHeight: 18,
  },

  InventoryItemDetailScreenDeleteBtn: {
    alignItems: 'center',
    backgroundColor: colors.dangerSoftStrong,
    borderColor: colors.dangerBorder,
    borderRadius: 14,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
  },

  InventoryItemDetailScreenDeleteLabel: {
    color: colors.danger,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
  InventoryItemDetailScreenToastChassis: {
    alignSelf: 'center',
    backgroundColor: colors.toastBg,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: 'absolute',
  },

  InventoryItemDetailScreenToastFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },
});
