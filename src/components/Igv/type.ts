interface IReference {
  id: string;
  fastaURL?: string;
  cytobandURL?: string;
}

export interface ITrackDefaults {
  bam: {
    coverageThreshold?: number;
    coverageQualityWeight?: boolean;
    [key: string]: any;
  };

  [key: string]: any;
}

export interface IIGVBrowser {
  loadTrack(config: IIGVTrack): void;
  loadTrackList(config: IIGVTrack[]): void;
  removeTrackByName(name: string): void;
  search(locusOrGene: string): void;
}

export interface IIGVBrowserOptions {
  genome?: string;
  reference?: IReference;
  palette?: string[];
  locus: string;
  tracks?: any[];
}

export interface ICommonTrack {
  type?: 'annotation' | 'wig' | 'alignment' | 'variant' | 'seg';
  /**
   * Type of data source. Valid values are "file", "gcs" for Google Cloud Storage, and "ga4gh" for the Global Alliance API  "file"
   * @default file
   */
  sourceType?: 'file' | 'gcs' | 'ga4gh';
  /**
   * File format  No default. If not specified format is inferred from file name extension
   */
  format?: string;
  /**
   * Display name (label). Required
   */
  name: string;
  /**
   * URL to the track data resource, such as a file or webservice. Required
   */
  url: string;
  /**
   * URL to a file index, such as a BAM .bai, Tabix .tbi, or Tribble .idx file.
   */
  indexURL: string;
  /**
   * Flag used to indicate if a file is indexed or not. If indexURL is provided this flag is redundant, its main purpose is to indicate that a file is not indexed.
   */
  indexed?: boolean;
  /**
   * Integer value specifying relative order of track position on the screen. To pin a track to the bottom use Number.MAX_VALUE. If no order is specified, tracks appear in order of their addition.
   */
  order?: number;
  /**
   * CSS color value for track features, e.g. "#ff0000" or "rgb(100,0,100)"
   */
  color?: string;
  /**
   * Initial height of track viewport in pixels
   * @default 50
   */
  height?: number;
  /**
   * If true, then track height is adjusted dynamically, within the bounds set by minHeight and maxHeight, to accomdodate features in view
   * @default true;
   */
  autoHeight?: boolean;
  /**
   * Minimum height of track in pixels  50
   * @default 50
   */
  minHeight?: number;
  /**
   * Maximum height of track in pixels
   * @default 500
   */
  maxHeight?: number;
  /**
   * Maximum window size in base pairs for which indexed annotations or variants are displayed  1 MB for variants, 30 KB for alignments, whole chromosome for other track types
   */
  visibilityWindow?: number;

  sort?: any;
}

export interface IAnnotationTrack extends ICommonTrack {
  type?: 'annotation';
  /**
   * Annotation display mode, one of "COLLAPSED", "EXPANDED", "SQUISHED"  "COLLAPSED"
   * @default COLLAPSED
   */
  displayMode?: 'COLLAPSED' | 'EXPANDED' | 'SQUISHED';
  /**
   * height of each row of features in "EXPANDED" mode
   * @default 30
   */
  expandedRowHeight?: number;
  /**
   * Height of each row of features in "SQUISHED" mode
   * @default 15
   */
  squishedRowHeight?: number;

  /**
   * For GFF/GTF file formats. Name of column 9 property to be used for feature label
   * @default Name
   */
  nameField?: string;
  /**
   * Maximum number of rows of features to display
   * @default 500
   */
  maxRows?: number;
  /**
   * If true, feature names for this track can be searched for. Use this option with caution, it is memory intensive. This option should will not work with indexed tracks
   * @default false
   */
  searchable?: boolean;
}

export interface IWigTrack extends ICommonTrack {
  type?: 'wig';
  /**
   * Autoscale track to maximum value in view
   */
  autoscale?: boolean;
  /**
   * Sets the minimum value for the data (y-axis) scale. Usually zero.
   * @default 0
   */
  min?: number;
  /**
   * Sets the maximum value for the data (y-axis) scale. This value is ignored if autoscale = true
   * No default
   */
  max?: number;
}

export interface IAlignmentTrack extends ICommonTrack {
  type?: 'alignment';
  /**
   * If true, paired reads are drawn as a single alignment.
   * @default false
   */
  viewAsPairs?: boolean;
  /**
   * if false, mate information in paired reads is ignored during downsampling and the 'View as Pairs' option is removed from the alignment track menu.
   * @default true
   */
  pairsSupported?: boolean;
  /**
   * Color of line representing a deletion
   * @default "black";
   */
  deletionColor?: string;
  /**
   * Color of line representing a skipped region (e.g. splice junction)
   * @default "rgb(150, 170, 170)"
   */
  skippedColor?: string;
  /**
   * Color of marker for insertions
   * @default "rgb(138, 94, 161)";
   */
  insertionColor?: string;
  /**
   *  Color of alignment on negative strand. Applicable if colorBy = "strand"
   *  @default "rgba(150, 150, 230, 0.75)";
   */
  negStrandColor?: string;
  /**
   * Color of alignment or position strand. Applicable if colorBy = "strand"
   * @default "rgba(230, 150, 150, 0.75)";
   */
  posStrandColor?: string;
  /**
   * Alignment color option: one of "none", "strand", "firstInPairStrand", or "tag". Specify tag with colorByTag
   * @default "none"
   */
  colorBy?: 'none' | 'strand' | 'firstInPairStrand' | 'tag';
  /**
   *  Specific tag to color alignment by.
   */
  colorByTag?: string;
  /**
   * Specifies a special tag that explicitly encodes an r,g,b color value. Default value is "YC". If "YC" does not encode an r,g,b color value set bamColorTag to null. Must also set "colorBy" to "tag" to enable this option.
   * @defaut 'YC'
   */
  bamColorTag?: string;
  /**
   *  Window (bucket) size for alignment downsampling in base pairs
   *  @default 100
   */
  samplingWindowSize?: number;
  /**
   * Number of alignments to keep per bucket. WARNING: Setting this sampling depth to a high value will likely freeze the browser when viewing areas of deep coverage.
   * @default 50.
   */
  samplingDepth?: number;
  /**
   * Maximum number of rows of alignments to display. Note: due to a limit on canvas height the maximum value for this parameter is ~2300 at the default row height of 14.
   * @default 1000
   */
  maxRows?: number;
  /**
   * Height in pixels of an alignment row when in expanded mode
   * @defalt 14
   */
  alignmentRowHeight?: number;
  /**
   * Alignment filter object.
   */
  filter?: IAlignmentFilter;
}

export interface IGA4GHAlignemntTrack extends IAlignmentTrack {
  sourceType: 'ga4gh';
  /**
   * URL to the ga4gh endpoint (e.g. https://www.googleapis.com/genomics/v1beta2)
   */
  url: string;
  /**
   * ID of the read group set represented by this track. (e.g. 'CMvnhpKTFhCjz9_25e_lCw')
   */
  readGroupSetIds: string;
}

export interface IAlignmentFilter {
  /**
   * filter alignments marked as failing vendor quality checks (bit 0x200)
   * @default true
   */
  vendorFailed?: boolean;
  /**
   * filter alignments marked as a duplicate (bit 0x400)
   * @default true
   */
  duplicates?: boolean;
  /**
   * filter alignments marked secondary (bit 0x100)
   * @default false
   */
  secondary?: boolean;
  /**
   * filter alignments marked as supplmentary (bit 0x800)
   * @default false
   */
  supplementary?: boolean;
  /**
   * filter alignments with mapping quality < supplied value (a number)
   * @default 0
   */
  mqThreshold?: number;
}

export interface IVariantTrack extends ICommonTrack {
  /**
   * COLLAPSED => show variants only, SQUISHED and EXPANDED => show calls.
   * @default EXPANDED
   */
  displayMode?: 'COLLAPSED' | 'EXPANDED' | 'SQUISHED';
  /**
   * CSS color used to represent homozygous non-reference calls.
   * @default "rgb(17,248,254)"
   */
  homvarColor?: string;
  /**
   * CSS color used to represent heterozygous calls.
   * @default "rgb(34,12,253)"
   */
  hetvarColor?: string;
  /**
   * CSS color used to represent homozygous reference calls.
   * @default "rgb(200, 200, 200)"
   */
  homrefColor?: string;
}

export interface IGA4GHVariantTrack extends IVariantTrack {
  sourceType: 'ga4gh';
  /**
   * URL to the ga4gh endpoint (e.g. https://www.googleapis.com/genomics/v1beta2). Required
   */
  url: string;
  /**
   * ID of the variant set represented by this track. (e.g. '10473108253681171589'). Required
   */
  variantSetId: string;
  /**
   *  Array of GACallSet IDs to include with track. Optional. If omitted, all call sets are included
   */
  callSetIds?: string[];
}

export interface ISegmentTrack extends ICommonTrack {
  type?: 'seg';
}

export declare type IIGVTrack =
  | IAlignmentTrack
  | IVariantTrack
  | IAnnotationTrack
  | IGA4GHAlignemntTrack
  | IGA4GHVariantTrack
  | IWigTrack
  | ISegmentTrack;

export declare function createBrowser(div: HTMLElement, options: IIGVBrowserOptions): IIGVBrowser;

export declare const browser: IIGVBrowser;
