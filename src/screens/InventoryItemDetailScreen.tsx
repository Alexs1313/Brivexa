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

import { appFondo } from '../data/assets';

import { useGranja } from '../data/FarmContext';

import type { StockStatus } from '../data/farm';
import { useAdaptativo } from '../hooks/useAdaptativo';

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
  const adaptive = useAdaptativo();
  const { getInventoryArticulo, addExistencias, useExistencias, removeInventoryArticulo } =
    useGranja();
  const item = getInventoryArticulo(itemId);
  const [stockModo, setStockModo] = useState<StockMode>(null);
  const [toast, setAviso] = useState<string | null>(null);

  if (!item) {
    return (
      <View style={styles.InventoryItemDetailScreenMissingBolsillo}>
        <Text style={styles.InventoryItemDetailScreenMissingFiligrana}>
          Item not found
        </Text>
        <Pressable onPress={onBack}>
          <Text style={styles.InventoryItemDetailScreenNavLinkFiligrana}>
            ‹ Inventory
          </Text>
        </Pressable>
      </View>
    );
  }

  const rows = [
    { label: 'Current Quantity', value: item.quantityEtiqueta },
    { label: 'Minimum Level', value: `${item.minCantidad} ${item.unit}` },
    { label: 'Unit Cost', value: item.unitCostEtiqueta },
    { label: 'Total Value', value: item.totalValueEtiqueta },
    { label: 'Supplier', value: item.supplier },
    { label: 'Purchase Date', value: item.purchaseFecha },
  ];

  const showAviso = (message: string) => {
    setAviso(message);
    setTimeout(() => setAviso(null), 2000);
  };

  return (
    <ImageBackground
      source={appFondo}
      style={styles.InventoryItemDetailScreenRaizCasco}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.InventoryItemDetailScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalEscala(6),
            paddingBottom: insets.bottom + adaptive.verticalEscala(28),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.InventoryItemDetailScreenHeaderRowDintel}>
          <Pressable
            onPress={onBack}
            hitSlop={12}
            style={styles.InventoryItemDetailScreenNavSide}
          >
            <Text style={styles.InventoryItemDetailScreenNavLinkFiligrana}>
              ‹ Inventory
            </Text>
          </Pressable>
          <Text style={styles.InventoryItemDetailScreenTitleFiligrana}>
            Item
          </Text>
          <Pressable
            onPress={onEdit}
            hitSlop={12}
            style={styles.InventoryItemDetailScreenNavSideRight}
          >
            <Text style={styles.InventoryItemDetailScreenNavLinkBoldFiligrana}>
              Edit
            </Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: adaptive.horizontalRelleno }}>
          <View style={styles.InventoryItemDetailScreenIdentityRowDintel}>
            <View style={styles.InventoryItemDetailScreenFlexBolsillo}>
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
              onPress={() => setStockModo('add')}
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
              onPress={() => setStockModo('use')}
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

          <Text style={styles.InventoryItemDetailScreenSectionTitleFiligrana}>
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
                <View style={styles.InventoryItemDetailScreenFlexBolsillo}>
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
                  {move.amountEtiqueta}
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
              removeInventoryArticulo(itemId);
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
            styles.InventoryItemDetailScreenToastCasco,
            { bottom: insets.bottom + adaptive.verticalEscala(24) },
          ]}
        >
          <Text style={styles.InventoryItemDetailScreenToastFiligrana}>
            {toast}
          </Text>
        </View>
      ) : null}

      <AmountModal
        visible={stockModo === 'add'}
        title="Add Stock"
        subtitle={item.name}
        unitEtiqueta={item.unit}
        placeholder="e.g. 10"
        confirmEtiqueta="Add Stock"
        onCancel={() => setStockModo(null)}
        onConfirmar={amount => {
          addExistencias(itemId, amount);
          setStockModo(null);
          showAviso(`Added ${amount} ${item.unit}`);
        }}
      />
      <AmountModal
        visible={stockModo === 'use'}
        title="Use Stock"
        subtitle={`Available: ${item.quantityEtiqueta}`}
        unitEtiqueta={item.unit}
        placeholder="e.g. 2"
        confirmEtiqueta="Use Stock"
        onCancel={() => setStockModo(null)}
        onConfirmar={amount => {
          const ok = useExistencias(itemId, amount);
          setStockModo(null);
          showAviso(ok ? `Used ${amount} ${item.unit}` : 'Not enough stock');
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
      ? colors.successSuave
      : status === 'Low Stock'
      ? colors.prioritySuave
      : colors.dangerSuave;

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
  InventoryItemDetailScreenRaizCasco: {
    backgroundColor: colors.background,
    flex: 1,
  },
  InventoryItemDetailScreenMissingBolsillo: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },

  InventoryItemDetailScreenMissingFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 18,
    marginBottom: 12,
  },

  InventoryItemDetailScreenScrollContent: { flexGrow: 1 },



  InventoryItemDetailScreenHeaderRowDintel: {
    alignItems: 'center',
    borderBottomColor: colors.borderSuave,
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



  InventoryItemDetailScreenNavLinkFiligrana: {
    color: colors.gold,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
  },

  InventoryItemDetailScreenNavLinkBoldFiligrana: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
  },



  InventoryItemDetailScreenTitleFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },
  InventoryItemDetailScreenIdentityRowDintel: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  InventoryItemDetailScreenFlexBolsillo: { flex: 1 },
  InventoryItemDetailScreenItemName: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 22,
    fontWeight: '700',
  },



  InventoryItemDetailScreenItemCategory: {
    color: colors.bodyApagado,
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
    borderBottomColor: colors.borderSuave,
    borderBottomWidth: 1,
  },

  InventoryItemDetailScreenKvLabel: {
    color: colors.bodyApagado,
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
    backgroundColor: colors.successBoton,
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
    backgroundColor: colors.backBoton,
    borderColor: colors.backButtonBorde,
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



  InventoryItemDetailScreenSectionTitleFiligrana: {
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
    color: colors.bodyApagado,
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



  InventoryItemDetailScreenAmountOut: { color: colors.expenseDinero },


  InventoryItemDetailScreenAmountBalance: { color: colors.cream },



  InventoryItemDetailScreenAlertCard: {
    backgroundColor: colors.dangerSoftStrong,
    borderColor: colors.dangerBorde,
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
    color: colors.bodySuave,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    lineHeight: 18,
  },



  InventoryItemDetailScreenDeleteBtn: {
    alignItems: 'center',
    backgroundColor: colors.dangerSoftStrong,
    borderColor: colors.dangerBorde,
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



  InventoryItemDetailScreenToastCasco: {
    alignSelf: 'center',
    backgroundColor: colors.toastBg,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: 'absolute',
  },


  InventoryItemDetailScreenToastFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },
});
