/**
 * Refrigerant Pressure-Temperature Data (copied from repository source)
 * Source: ASHRAE Fundamentals 2021 and manufacturer tables
 * NOTE: Keep this file under src/modules/refrigeration so the engine uses a local, auditable PT dataset.
 */
export const REFRIGERANT_DATA = {
    'R-410A': {
        name: 'R-410A (Puron, AZ-20)',
        type: 'HFC Blend (R-32/R-125)',
        gwp: 2088,
        source: 'ASHRAE Fundamentals 2021, Table 3 (Chapter 30)',
        notes: 'Most common residential/light commercial refrigerant post-2010',
        pt: [
            [-40, -16.9], [-35, -11.2], [-30, -4.8], [-25, 2.3], [-20, 10.1],
            [-15, 18.6], [-10, 27.9], [-5, 38.0], [0, 48.9], [5, 60.6],
            [10, 73.3], [15, 86.8], [20, 101.4], [25, 117.0], [30, 133.7],
            [35, 151.6], [40, 170.8], [45, 191.2], [50, 213.0], [55, 236.2],
            [60, 261.0], [65, 287.2], [70, 315.2], [75, 345.0], [80, 376.6],
            [85, 410.2], [90, 445.8], [95, 483.4], [100, 523.2], [105, 565.2],
            [110, 609.5], [115, 656.1], [120, 705.2], [125, 756.8], [130, 811.0]
        ]
    },
    'R-22': {
        name: 'R-22 (HCFC-22)',
        type: 'HCFC',
        gwp: 1810,
        source: 'ASHRAE Fundamentals 2021, Table 3 (Chapter 30)',
        notes: 'Legacy refrigerant, production banned 2020, still in service',
        pt: [
            [-40, -8.5], [-35, -2.8], [-30, 3.5], [-25, 10.5], [-20, 18.3],
            [-15, 26.9], [-10, 36.4], [-5, 46.8], [0, 58.2], [5, 70.6],
            [10, 84.0], [15, 98.6], [20, 114.3], [25, 131.3], [30, 149.6],
            [35, 169.2], [40, 190.3], [45, 212.9], [50, 237.0], [55, 262.8],
            [60, 290.3], [65, 319.6], [70, 350.8], [75, 384.0], [80, 419.2],
            [85, 456.5], [90, 496.1], [95, 537.9], [100, 582.1], [105, 628.7],
            [110, 677.9], [115, 729.7], [120, 784.2], [125, 841.5], [130, 901.7]
        ]
    },
    'R-134a': {
        name: 'R-134a (HFC-134a)',
        type: 'HFC',
        gwp: 1430,
        source: 'ASHRAE Fundamentals 2021, Table 3 (Chapter 30)',
        notes: 'Common automotive and low-temp chiller refrigerant',
        pt: [
            [-40, -7.6], [-35, -1.4], [-30, 5.4], [-25, 12.9], [-20, 21.1],
            [-15, 30.1], [-10, 39.9], [-5, 50.7], [0, 62.4], [5, 75.2],
            [10, 89.2], [15, 104.4], [20, 120.9], [25, 138.9], [30, 158.3],
            [35, 179.3], [40, 202.0], [45, 226.4], [50, 252.7], [55, 281.0],
            [60, 311.3], [65, 343.8], [70, 378.6], [75, 415.8], [80, 455.5],
            [85, 497.8], [90, 542.9], [95, 590.9], [100, 641.9], [105, 696.0],
            [110, 753.4], [115, 814.3], [120, 878.8], [125, 947.0], [130, 1019.0]
        ]
    },
    'R-404A': {
        name: 'R-404A',
        type: 'HFC Blend',
        gwp: 3922,
        source: 'ASHRAE Fundamentals 2021, Table 3 (Chapter 30)',
        notes: 'Commercial refrigeration, being phased out due to high GWP',
        pt: [
            [-40, -5.4], [-35, 1.3], [-30, 8.6], [-25, 16.7], [-20, 25.6],
            [-15, 35.4], [-10, 46.2], [-5, 58.0], [0, 70.9], [5, 85.0],
            [10, 100.3], [15, 117.0], [20, 135.1], [25, 154.7], [30, 175.9],
            [35, 198.8], [40, 223.5], [45, 250.1], [50, 278.7], [55, 309.4],
            [60, 342.3], [65, 377.6], [70, 415.4], [75, 455.9], [80, 499.2],
            [85, 545.4], [90, 594.7], [95, 647.3], [100, 703.3], [105, 762.9],
            [110, 826.3], [115, 893.6], [120, 965.1], [125, 1040.9], [130, 1121.3]
        ]
    },
    'R-407C': {
        name: 'R-407C',
        type: 'HFC Blend',
        gwp: 1774,
        source: 'ASHRAE Fundamentals 2021, Table 3 (Chapter 30)',
        notes: 'R-22 replacement, zeotropic blend (temperature glide ~10°F)',
        warnings: ['Temperature glide requires careful charging and monitoring'],
        pt: [
            [-40, -10.2], [-35, -4.2], [-30, 2.4], [-25, 9.7], [-20, 17.7],
            [-15, 26.6], [-10, 36.3], [-5, 47.0], [0, 58.7], [5, 71.6],
            [10, 85.6], [15, 100.9], [20, 117.6], [25, 135.7], [30, 155.4],
            [35, 176.7], [40, 199.8], [45, 224.7], [50, 251.6], [55, 280.6],
            [60, 311.9], [65, 345.5], [70, 381.7], [75, 420.5], [80, 462.1],
            [85, 506.7], [90, 554.5], [95, 605.5], [100, 660.1], [105, 718.3],
            [110, 780.4], [115, 846.6], [120, 917.1], [125, 992.2], [130, 1071.9]
        ]
    },
    'R-454B': {
        name: 'R-454B (XL41, Puron Advance)',
        type: 'HFO Blend (R-32/R-1234yf)',
        gwp: 466,
        source: 'Manufacturer data (Chemours XL41), AHRI certification',
        notes: 'NEW LOW-GWP - A2L refrigerant, verify local approval and technician certification',
        warnings: [
            'A2L classification: mildly flammable',
            'Requires updated equipment design',
            'Not direct drop-in for R-410A',
            'Verify technician certification for A2L refrigerants'
        ],
        pt: [
            [-40, -17.8], [-35, -12.0], [-30, -5.6], [-25, 1.5], [-20, 9.2],
            [-15, 17.7], [-10, 27.1], [-5, 37.4], [0, 48.7], [5, 61.0],
            [10, 74.5], [15, 89.1], [20, 105.0], [25, 122.2], [30, 140.8],
            [35, 161.0], [40, 182.7], [45, 206.2], [50, 231.4], [55, 258.5],
            [60, 287.5], [65, 318.7], [70, 352.0], [75, 387.6], [80, 425.7],
            [85, 466.3], [90, 509.6], [95, 555.8], [100, 605.0], [105, 657.4],
            [110, 713.2], [115, 772.5], [120, 835.5], [125, 902.4], [130, 973.4]
        ]
    },
    'R-32': {
        name: 'R-32 (Difluoromethane)',
        type: 'HFC',
        gwp: 675,
        source: 'ASHRAE Fundamentals 2021, Manufacturer data',
        notes: 'Low-GWP alternative, A2L flammable classification',
        warnings: ['A2L flammable', 'Verify equipment compatibility'],
        pt: [
            [-40, -9.2], [-35, -2.8], [-30, 4.3], [-25, 12.1], [-20, 20.8],
            [-15, 30.3], [-10, 40.8], [-5, 52.3], [0, 65.0], [5, 78.8],
            [10, 94.0], [15, 110.5], [20, 128.4], [25, 148.0], [30, 169.2],
            [35, 192.2], [40, 217.1], [45, 244.1], [50, 273.2], [55, 304.7],
            [60, 338.7], [65, 375.3], [70, 414.6], [75, 456.9], [80, 502.3],
            [85, 550.9], [90, 603.0], [95, 658.8], [100, 718.4], [105, 782.1],
            [110, 850.1], [115, 922.7], [120, 1000.0], [125, 1082.3], [130, 1169.8]
        ]
    },
    'R-448A': {
        name: 'R-448A (Solstice N40)',
        type: 'HFO Blend',
        gwp: 1387,
        source: 'Manufacturer data (Honeywell), AHRI certification',
        notes: 'R-404A/R-22 replacement for commercial refrigeration',
        pt: [
            [-40, -6.8], [-35, -0.3], [-30, 6.8], [-25, 14.5], [-20, 23.0],
            [-15, 32.4], [-10, 42.7], [-5, 54.0], [0, 66.3], [5, 79.8],
            [10, 94.5], [15, 110.5], [20, 127.8], [25, 146.5], [30, 166.8],
            [35, 188.7], [40, 212.3], [45, 237.7], [50, 265.0], [55, 294.3],
            [60, 325.7], [65, 359.3], [70, 395.3], [75, 433.7], [80, 474.7],
            [85, 518.5], [90, 565.1], [95, 614.8], [100, 667.7], [105, 723.9],
            [110, 783.7], [115, 847.2], [120, 914.6], [125, 986.1], [130, 1061.9]
        ]
    }
};
export function getRefrigerantTypes() {
    return Object.keys(REFRIGERANT_DATA);
}
export function getRefrigerantData(type) {
    return REFRIGERANT_DATA[type] || null;
}
export function isValidRefrigerant(type) {
    return type in REFRIGERANT_DATA;
}
