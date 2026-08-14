import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { colors, fonts, radius } from '../constants/theme';

import { appFondo } from '../data/assets';
import {
  EXPENSE_CATEGORIAS,
  FINANCE_SUMMARY,
  FARM_DEMO_BANDA,
  FARM_SECTIONS,
  SEASON_REPORT,
  equipmentTotales,
  inventoryTotales,
  type EquipmentStatus,
  type FarmEquipment,
  type FarmSection,
  type InventoryItem,
  type StockStatus,
} from '../data/farm';

import { useGranja } from '../data/FarmContext';
import { useAdaptativo } from '../hooks/useAdaptativo';

type FarmScreenProps = {
  onOpenArticulo: (itemId: string) => void;
  onAddArticulo: () => void;
  onOpenEquipo: (equipmentId: string) => void;
  onAddIngreso: () => void;
  onOpenInforme: () => void;
  toastMensaje?: string | null;
};

export function FarmScreen({
  onOpenArticulo,
  onAddArticulo,
  onOpenEquipo,
  onAddIngreso,
  onOpenInforme,
  toastMensaje,
}: FarmScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptativo();
  const [section, setSeccion] = useState<FarmSection>('Inventory');

  return (
    <ImageBackground
      source={appFondo}
      style={styles.FarmScreenRaizCasco}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.FarmScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalEscala(8),
            paddingBottom: adaptive.verticalEscala(110),
            paddingHorizontal: adaptive.horizontalRelleno,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.FarmScreenTitleFiligrana}>Farm</Text>

        <View style={styles.FarmScreenSectionRowDintel}>
          {FARM_SECTIONS.map(item => {
            const active = item === section;
            return (
              <Pressable
                key={item}
                onPress={() => setSeccion(item)}
                style={[
                  styles.FarmScreenSectionChip,
                  active
                    ? styles.FarmScreenSectionChipActive
                    : styles.FarmScreenSectionChipIdle,
                ]}
              >
                <Text
                  style={[
                    styles.FarmScreenSectionChipLabel,
                    active && styles.FarmScreenSectionChipLabelActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {section === 'Inventory' ? (
          <InventorySection onOpenArticulo={onOpenArticulo} onAddArticulo={onAddArticulo} />
        ) : null}
        {section === 'Equipment' ? (
          <EquipmentSection onOpenEquipo={onOpenEquipo} />
        ) : null}
        {section === 'Finance' ? (
          <FinanceSection onAddIngreso={onAddIngreso} />
        ) : null}
        {section === 'Reports' ? (
          <ReportsSection onOpenInforme={onOpenInforme} />
        ) : null}
      </ScrollView>

      {toastMensaje ? (
        <View
          style={[
            styles.FarmScreenToastCasco,
            { bottom: insets.bottom + adaptive.verticalEscala(92) },
          ]}
        >
          <Text style={styles.FarmScreenToastCheck}>✓</Text>
          <Text style={styles.FarmScreenToastFiligrana}>{toastMensaje}</Text>
        </View>
      ) : null}
    </ImageBackground>
  );
}

function InventorySection({
  onOpenArticulo,
  onAddArticulo,
}: {
  onOpenArticulo: (itemId: string) => void;
  onAddArticulo: () => void;
}) {
  const { inventory: items, isInventoryMuestra } = useGranja();
  const totals = useMemo(() => inventoryTotales(items), [items]);

  if (items.length === 0) {
    return (
      <View style={styles.FarmScreenEmptyCasco}>
        <Text style={styles.FarmScreenEmptyEmoji}>📦</Text>
        <Text style={styles.FarmScreenEmptyTitle}>No inventory items yet</Text>
        <Text style={styles.FarmScreenEmptyBody}>
          Add grain, fertilizer, fuel and parts to track stock.
        </Text>
        <PrimaryButton
          label="+ Add Item"
          onPress={onAddArticulo}
          style={styles.FarmScreenEmptyBtn}
        />
      </View>
    );
  }

  return (
    <View>
      {isInventoryMuestra ? (
        <View style={styles.FarmScreenDemoBannerCasco}>
          <Text style={styles.FarmScreenDemoBannerEmblema}>ℹ️</Text>
          <Text style={styles.FarmScreenDemoBannerFiligrana}>
            {FARM_DEMO_BANDA}
          </Text>
        </View>
      ) : null}

      <View style={styles.FarmScreenStatRow}>
        <View style={styles.FarmScreenStatCard}>
          <Text style={styles.FarmScreenStatLabel}>Total Value</Text>
          <Text style={styles.FarmScreenStatValueGold}>
            {totals.totalValueEtiqueta}
          </Text>
        </View>
        <View style={styles.FarmScreenStatCard}>
          <Text style={styles.FarmScreenStatLabel}>Needs Attention</Text>
          <Text style={styles.FarmScreenStatValueWarn}>
            {totals.needsAtencion}
          </Text>
        </View>
      </View>

      <View style={styles.FarmScreenSectionHeaderDintel}>
        <Text style={styles.FarmScreenSectionTitleFiligrana}>Items</Text>
        <Pressable onPress={onAddArticulo} hitSlop={8}>
          <Text style={styles.FarmScreenSectionActionFiligrana}>+ Add Item</Text>
        </Pressable>
      </View>

      <View style={styles.FarmScreenListStack}>
        {items.map(item => (
          <InventoryCard
            key={item.id}
            item={item}
            onPress={() => onOpenArticulo(item.id)}
          />
        ))}
      </View>
    </View>
  );
}

function InventoryCard({
  item,
  onPress,
}: {
  item: InventoryItem;
  onPress: () => void;
}) {
  const barColor =
    item.status === 'Available'
      ? colors.success
      : item.status === 'Low Stock'
      ? colors.priorityHigh
      : colors.danger;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.FarmScreenCard,
        pressed && styles.FarmScreenPressedDim,
      ]}
    >
      <View style={styles.FarmScreenCardTopRow}>
        <View style={styles.FarmScreenFlexBolsillo}>
          <Text style={styles.FarmScreenCardTitle}>{item.name}</Text>
          <Text style={styles.FarmScreenCardSubtitle}>{item.category}</Text>
        </View>
        <StockPill status={item.status} />
      </View>
      <View style={styles.FarmScreenQtyRow}>
        <Text>
          <Text style={styles.FarmScreenQtyPrimary}>{item.quantityEtiqueta}</Text>
          <Text
            style={styles.FarmScreenQtySecondary}
          >{` / ${item.minEtiqueta}`}</Text>
        </Text>
        <Text style={styles.FarmScreenPriceLabel}>{item.priceEtiqueta}</Text>
      </View>
      <View style={styles.FarmScreenProgressTrack}>
        <View
          style={[
            styles.FarmScreenProgressFill,
            {
              backgroundColor: barColor,
              width: `${Math.max(
                item.progress * 100,
                item.progress > 0 ? 2 : 0,
              )}%`,
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

function EquipmentSection({
  onOpenEquipo,
}: {
  onOpenEquipo: (equipmentId: string) => void;
}) {
  const { equipment, addEquipo, isEquipmentMuestra } = useGranja();
  const totals = equipmentTotales(equipment);

  if (equipment.length === 0) {
    return (
      <View style={styles.FarmScreenEmptyCasco}>
        <Text style={styles.FarmScreenEmptyEmoji}>🚜</Text>
        <Text style={styles.FarmScreenEmptyTitle}>No equipment yet</Text>
        <Text style={styles.FarmScreenEmptyBody}>
          Add tractors, harvesters and sprayers to track hours and service.
        </Text>
        <PrimaryButton
          label="+ Add Equipment"
          onPress={() => {
            const item = addEquipo();
            onOpenEquipo(item.id);
          }}
          style={styles.FarmScreenEmptyBtn}
        />
      </View>
    );
  }

  return (
    <View>
      {isEquipmentMuestra ? (
        <View style={styles.FarmScreenDemoBannerCasco}>
          <Text style={styles.FarmScreenDemoBannerEmblema}>ℹ️</Text>
          <Text style={styles.FarmScreenDemoBannerFiligrana}>
            {FARM_DEMO_BANDA}
          </Text>
        </View>
      ) : null}

      <View style={styles.FarmScreenEquipStatRow}>
        <View style={styles.FarmScreenEquipStatCard}>
          <Text style={styles.FarmScreenEquipStatValueSuccess}>
            {totals.available}
          </Text>
          <Text style={styles.FarmScreenEquipStatLabel}>Available</Text>
        </View>
        <View style={styles.FarmScreenEquipStatCard}>
          <Text style={styles.FarmScreenEquipStatValueInfo}>
            {totals.inUse}
          </Text>
          <Text style={styles.FarmScreenEquipStatLabel}>In Use</Text>
        </View>
        <View style={styles.FarmScreenEquipStatCard}>
          <Text style={styles.FarmScreenEquipStatValueWarn}>
            {totals.service}
          </Text>
          <Text style={styles.FarmScreenEquipStatLabel}>Service</Text>
        </View>
      </View>

      <View style={styles.FarmScreenSectionHeaderDintel}>
        <Text style={styles.FarmScreenSectionTitleFiligrana}>Machines</Text>
        <Pressable
          onPress={() => {
            const item = addEquipo();
            onOpenEquipo(item.id);
          }}
          hitSlop={8}
        >
          <Text style={styles.FarmScreenSectionActionFiligrana}>+ Add</Text>
        </Pressable>
      </View>

      <View style={styles.FarmScreenListStack}>
        {equipment.map(item => (
          <EquipmentCard
            key={item.id}
            item={item}
            onPress={() => onOpenEquipo(item.id)}
          />
        ))}
      </View>
    </View>
  );
}

function EquipmentCard({
  item,
  onPress,
}: {
  item: FarmEquipment;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.FarmScreenEquipCard,
        pressed && styles.FarmScreenPressedDim,
      ]}
    >
      <View style={styles.FarmScreenEquipIcon}>
        <Text style={styles.FarmScreenEquipIconMarca}>{item.icon}</Text>
      </View>
      <View style={styles.FarmScreenEquipBody}>
        <View style={styles.FarmScreenCardTopRow}>
          <Text style={styles.FarmScreenCardTitle}>{item.name}</Text>
          <EquipmentPill status={item.status} />
        </View>
        <Text style={styles.FarmScreenCardSubtitle}>
          {item.type} · {item.hoursEtiqueta}
        </Text>
        {item.serviceAlerta ? (
          <Text style={styles.FarmScreenServiceAlert}>{item.serviceAlerta}</Text>
        ) : null}
        {item.assignedCampo ? (
          <Text style={styles.FarmScreenAssignedLine}>
            Assigned to {item.assignedCampo}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function FinanceSection({ onAddIngreso }: { onAddIngreso: () => void }) {
  const { transactions, isTransactionsMuestra } = useGranja();

  return (
    <View>
      {isTransactionsMuestra ? (
        <View style={styles.FarmScreenDemoBannerCasco}>
          <Text style={styles.FarmScreenDemoBannerEmblema}>ℹ️</Text>
          <Text style={styles.FarmScreenDemoBannerFiligrana}>
            {FARM_DEMO_BANDA}
          </Text>
        </View>
      ) : null}

      <View style={styles.FarmScreenProfitCard}>
        <Text style={styles.FarmScreenStatLabel}>Net Profit · This Season</Text>
        <Text style={styles.FarmScreenProfitValue}>
          {FINANCE_SUMMARY.netProfitEtiqueta}
        </Text>
        <View style={styles.FarmScreenProfitMetaRow}>
          <View>
            <Text style={styles.FarmScreenMetaLabel}>Income</Text>
            <Text style={styles.FarmScreenMetaValue}>
              {FINANCE_SUMMARY.incomeEtiqueta}
            </Text>
          </View>
          <View>
            <Text style={styles.FarmScreenMetaLabel}>Expenses</Text>
            <Text style={styles.FarmScreenMetaValueDanger}>
              {FINANCE_SUMMARY.expensesEtiqueta}
            </Text>
          </View>
          <View>
            <Text style={styles.FarmScreenMetaLabel}>Cost / ha</Text>
            <Text style={styles.FarmScreenMetaValue}>
              {FINANCE_SUMMARY.costPerHaEtiqueta}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.FarmScreenExpenseCard}>
        <Text style={styles.FarmScreenExpenseTitle}>Expenses by Category</Text>
        {EXPENSE_CATEGORIAS.map(cat => (
          <View key={cat.id} style={styles.FarmScreenExpenseRow}>
            <View style={styles.FarmScreenExpenseLabelRow}>
              <Text style={styles.FarmScreenExpenseLabel}>{cat.label}</Text>
              <Text style={styles.FarmScreenExpenseAmount}>
                {cat.amountEtiqueta}
              </Text>
            </View>
            <View style={styles.FarmScreenProgressTrackTall}>
              <View
                style={[
                  styles.FarmScreenProgressFill,
                  {
                    backgroundColor: cat.color,
                    width: `${cat.progress * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.FarmScreenSectionHeaderDintel}>
        <Text style={styles.FarmScreenSectionTitleFiligrana}>Transactions</Text>
        <Pressable onPress={onAddIngreso} hitSlop={8}>
          <Text style={styles.FarmScreenSectionActionFiligrana}>+ Add</Text>
        </Pressable>
      </View>

      {transactions.length === 0 ? (
        <View style={styles.FarmScreenEmptyCasco}>
          <Text style={styles.FarmScreenEmptyEmoji}>💵</Text>
          <Text style={styles.FarmScreenEmptyTitle}>No transactions yet</Text>
          <Text style={styles.FarmScreenEmptyBody}>
            Add income to start tracking farm finances.
          </Text>
          <PrimaryButton
            label="+ Add Income"
            onPress={onAddIngreso}
            style={styles.FarmScreenEmptyBtn}
          />
        </View>
      ) : (
        <View style={styles.FarmScreenListStack}>
          {transactions.map(tx => (
            <View key={tx.id} style={styles.FarmScreenTxCard}>
              <View
                style={[
                  styles.FarmScreenTxIcon,
                  tx.kind === 'income'
                    ? styles.FarmScreenTxIconIncome
                    : styles.FarmScreenTxIconExpense,
                ]}
              >
                <Text style={styles.FarmScreenTxIconMarca}>{tx.icon}</Text>
              </View>
              <View style={styles.FarmScreenFlexBolsillo}>
                <Text style={styles.FarmScreenTxTitle}>{tx.title}</Text>
                <Text style={styles.FarmScreenCardSubtitle}>{tx.subtitle}</Text>
              </View>
              <Text
                style={[
                  styles.FarmScreenTxAmount,
                  tx.kind === 'income'
                    ? styles.FarmScreenTxAmountIncome
                    : styles.FarmScreenTxAmountExpense,
                ]}
              >
                {tx.amountEtiqueta}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function ReportsSection({ onOpenInforme }: { onOpenInforme: () => void }) {
  return (
    <Pressable
      onPress={onOpenInforme}
      style={({ pressed }) => [
        styles.FarmScreenReportCard,
        pressed && styles.FarmScreenPressedDim,
      ]}
    >
      <Text style={styles.FarmScreenReportTitle}>{SEASON_REPORT.title}</Text>
      <Text style={styles.FarmScreenCardSubtitle}>
        {SEASON_REPORT.subtitle}
      </Text>
      <View style={styles.FarmScreenReportMetrics}>
        <Text style={styles.FarmScreenMetaLabel}>Net Profit</Text>
        <Text style={styles.FarmScreenProfitValueCompact}>$33,600</Text>
      </View>
      <Text style={styles.FarmScreenReportCta}>View full report →</Text>
    </Pressable>
  );
}

function StockPill({ status }: { status: StockStatus }) {
  const tone =
    status === 'Available'
      ? 'success'
      : status === 'Low Stock'
      ? 'warn'
      : 'danger';
  return (
    <View
      style={[
        styles.FarmScreenPill,
        tone === 'success' && styles.FarmScreenPillSuccess,
        tone === 'warn' && styles.FarmScreenPillWarn,
        tone === 'danger' && styles.FarmScreenPillDanger,
      ]}
    >
      <Text
        style={[
          styles.FarmScreenPillLabel,
          tone === 'success' && { color: colors.success },
          tone === 'warn' && { color: colors.priorityHigh },
          tone === 'danger' && { color: colors.danger },
        ]}
      >
        ● {status}
      </Text>
    </View>
  );
}

function EquipmentPill({ status }: { status: EquipmentStatus }) {
  const tone =
    status === 'Available' ? 'success' : status === 'In Use' ? 'info' : 'warn';
  return (
    <View
      style={[
        styles.FarmScreenPill,
        tone === 'success' && styles.FarmScreenPillSuccess,
        tone === 'info' && styles.FarmScreenPillInfo,
        tone === 'warn' && styles.FarmScreenPillWarn,
      ]}
    >
      <Text
        style={[
          styles.FarmScreenPillLabel,
          tone === 'success' && { color: colors.success },
          tone === 'info' && { color: colors.info },
          tone === 'warn' && { color: colors.priorityHigh },
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  FarmScreenRaizCasco: {
    backgroundColor: colors.background,
    flex: 1,
  },
  FarmScreenScrollContent: {
    flexGrow: 1,
  },

  FarmScreenTitleFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 14,
  },

  FarmScreenSectionRowDintel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  FarmScreenSectionChip: {
    borderRadius: 20,
    height: 31,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  FarmScreenSectionChipActive: {
    backgroundColor: colors.goldSuave,
  },
  FarmScreenSectionChipIdle: {
    backgroundColor: colors.plannedSuave,
  },
  FarmScreenSectionChipLabel: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },
  FarmScreenSectionChipLabelActive: {
    color: colors.gold,
  },
  FarmScreenDemoBannerCasco: {
    backgroundColor: colors.infoBanda,
    borderColor: colors.infoBannerBorde,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

  FarmScreenDemoBannerEmblema: {
    fontSize: 16,
    marginTop: 2,
  },
  FarmScreenDemoBannerFiligrana: {
    color: colors.infoBannerText,
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    lineHeight: 18,
  },

  FarmScreenStatRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },

  FarmScreenStatCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  FarmScreenStatLabel: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },

  FarmScreenStatValueGold: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },

  FarmScreenStatValueWarn: {
    color: colors.priorityHigh,
    fontFamily: fonts.sansBold,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  FarmScreenSectionHeaderDintel: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  FarmScreenSectionTitleFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },

  FarmScreenSectionActionFiligrana: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },
  FarmScreenListStack: {
    gap: 12,
  },

  FarmScreenCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 14,
  },
  FarmScreenPressedDim: {
    opacity: 0.9,
  },
  FarmScreenCardTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  FarmScreenFlexBolsillo: {
    flexShrink: 1,
  },
  FarmScreenCardTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
  FarmScreenCardSubtitle: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    marginTop: 2,
  },
  FarmScreenQtyRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  FarmScreenQtyPrimary: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 18,
    fontWeight: '700',
  },
  FarmScreenQtySecondary: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },

  FarmScreenPriceLabel: {
    color: colors.body,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },

  FarmScreenProgressTrack: {
    backgroundColor: colors.progressTrackDeep,
    borderRadius: 4,
    height: 7,
    marginTop: 10,
    overflow: 'hidden',
  },
  FarmScreenProgressTrackTall: {
    backgroundColor: colors.progressTrackDeep,
    borderRadius: 4,
    height: 8,
    marginTop: 5,
    overflow: 'hidden',
  },
  FarmScreenProgressFill: {
    borderRadius: 4,
    height: '100%',
  },
  FarmScreenPill: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  FarmScreenPillSuccess: {
    backgroundColor: colors.successSuave,
  },
  FarmScreenPillWarn: {
    backgroundColor: colors.prioritySuave,
  },
  FarmScreenPillDanger: {
    backgroundColor: colors.dangerSuave,
  },

  FarmScreenPillInfo: {
    backgroundColor: colors.infoSuave,
  },

  FarmScreenPillLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    fontWeight: '700',
  },
  FarmScreenEmptyCasco: {
    alignItems: 'center',
    backgroundColor: colors.emptyRelleno,
    borderColor: colors.emptyBorde,
    borderRadius: radius.card,
    borderStyle: 'dashed',
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  FarmScreenEmptyEmoji: {
    fontSize: 38,
    marginBottom: 12,
  },

  FarmScreenEmptyTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  FarmScreenEmptyBody: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  FarmScreenEmptyBtn: {
    marginTop: 18,
    minWidth: 130,
  },
  FarmScreenEquipStatRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  FarmScreenEquipStatCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 12,
  },

  FarmScreenEquipStatValueSuccess: {
    color: colors.success,
    fontFamily: fonts.sansBold,
    fontSize: 21,
    fontWeight: '700',
  },
  FarmScreenEquipStatValueInfo: {
    color: colors.info,
    fontFamily: fonts.sansBold,
    fontSize: 21,
    fontWeight: '700',
  },

  FarmScreenEquipStatValueWarn: {
    color: colors.priorityHigh,
    fontFamily: fonts.sansBold,
    fontSize: 21,
    fontWeight: '700',
  },

  FarmScreenEquipStatLabel: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 10,
    marginTop: 2,
  },
  FarmScreenEquipCard: {
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 13,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  FarmScreenEquipIcon: {
    alignItems: 'center',
    backgroundColor: colors.backBoton,
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  FarmScreenEquipIconMarca: {
    fontSize: 22,
  },

  FarmScreenEquipBody: {
    flex: 1,
  },

  FarmScreenServiceAlert: {
    color: colors.priorityHigh,
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    marginTop: 4,
  },
  FarmScreenAssignedLine: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    marginTop: 4,
  },

  FarmScreenProfitCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: 12,
    padding: 15,
  },
  FarmScreenProfitValue: {
    color: colors.success,
    fontFamily: fonts.sansBold,
    fontSize: 30,
    fontWeight: '700',
    marginTop: 4,
  },

  FarmScreenProfitValueCompact: {
    color: colors.success,
    fontFamily: fonts.sansBold,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  FarmScreenProfitMetaRow: {
    flexDirection: 'row',
    gap: 22,
    marginTop: 14,
  },
  FarmScreenMetaLabel: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 11,
  },

  FarmScreenMetaValue: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  FarmScreenMetaValueDanger: {
    color: colors.expenseDinero,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },

  FarmScreenExpenseCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: 18,
    padding: 15,
  },
  FarmScreenExpenseTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },

  FarmScreenExpenseRow: {
    marginBottom: 12,
  },

  FarmScreenExpenseLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  FarmScreenExpenseLabel: {
    color: colors.bodySuave,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },
  FarmScreenExpenseAmount: {
    color: colors.body,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },
  FarmScreenTxCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 11,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  FarmScreenTxIcon: {
    alignItems: 'center',
    borderRadius: 11,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },

  FarmScreenTxIconIncome: {
    backgroundColor: colors.successSuave,
  },
  FarmScreenTxIconExpense: {
    backgroundColor: colors.dangerSuave,
  },
  FarmScreenTxIconMarca: {
    fontSize: 16,
  },

  FarmScreenTxTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
  },
  FarmScreenTxAmount: {
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },

  FarmScreenTxAmountIncome: {
    color: colors.success,
  },

  FarmScreenTxAmountExpense: {
    color: colors.expenseDinero,
  },
  FarmScreenReportCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    padding: 18,
  },
  FarmScreenReportTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 18,
    fontWeight: '700',
  },

  FarmScreenReportMetrics: {
    marginTop: 16,
  },

  FarmScreenReportCta: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 16,
  },
  FarmScreenToastCasco: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.toastBg,
    borderColor: colors.emptyBorde,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    position: 'absolute',
  },

  FarmScreenToastCheck: {
    color: colors.success,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
  },

  FarmScreenToastFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
  },
});
