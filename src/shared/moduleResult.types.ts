import type { EngineResult, DiagnosticStatus, Recommendation } from './wshp.types';
import type { ValidationIssue } from './validation.types';
import type { CompletenessLevel } from './profileInput.types';

export interface ModuleResult<
  V extends object = Record<string, unknown>,
  F extends object = Record<string, unknown>
> extends EngineResult<V, F> {
  validation: ValidationIssue[];
  completeness: CompletenessLevel;
  summary: string;
}

import type {
  AirsideValues,
  AirsideEngineFlags,
} from '../modules/airside/airside.types';

import type {
  RefrigerationValues,
  RefrigerationFlags,
} from '../modules/refrigeration/refrigeration.types';

import type {
  ScrollCompressorValues,
  ScrollCompressorFlags,
} from '../modules/compressor/scroll.types';

import type {
  ReciprocatingCompressorValues,
  ReciprocatingCompressorFlags,
} from '../modules/compressor/recip.types';

import type {
  HydronicValues,
  HydronicFlags,
} from '../modules/hydronic/hydronic.types';

import type {
  ReversingValveValues,
  ReversingValveFlags,
} from '../modules/reversingValve/reversing.types';

import type {
  CondenserApproachValues,
  CondenserApproachFlags,
} from '../modules/condenserApproach/condenserApproach.types';

export type AirsideModuleResult =
  ModuleResult<AirsideValues, AirsideEngineFlags>;

export type RefrigerationModuleResult =
  ModuleResult<RefrigerationValues, RefrigerationFlags>;

export type ScrollCompressorModuleResult =
  ModuleResult<ScrollCompressorValues, ScrollCompressorFlags>;

export type ReciprocatingCompressorModuleResult =
  ModuleResult<ReciprocatingCompressorValues, ReciprocatingCompressorFlags>;

export type HydronicModuleResult =
  ModuleResult<HydronicValues, HydronicFlags>;

export type ReversingValveModuleResult =
  ModuleResult<ReversingValveValues, ReversingValveFlags>;

export type CondenserApproachModuleResult =
  ModuleResult<CondenserApproachValues, CondenserApproachFlags>;
