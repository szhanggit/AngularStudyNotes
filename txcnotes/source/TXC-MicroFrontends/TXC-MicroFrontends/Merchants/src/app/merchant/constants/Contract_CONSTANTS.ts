export const Contract_CONSTANTS = {
    termList:  [
        {
          text: 'When purchase', value: '1',
          priceOptionList: [
            { text: 'Upon purchase', value: '1' },
          ]
        },
        {
          text: 'When issue', value: '2',
          priceOptionList: [
            { text: 'Upon issue', value: '2' },
          ]
        },
        {
          text: 'When redeem', value: '3',
          priceOptionList: [
            { text: 'Upon purchase', value: '1' },
            { text: 'Upon issue', value: '2' },
            { text: 'Upon redeem', value: '3' },
          ]
        }
      ],

      costSchemeList: [
        { text: 'Default Cost %', value: '1' },
        { text: 'Fixed', value: '2' }
      ],
    
      roundingRuleList: [
        { text: 'Round up', value: '1' },
        { text: 'Round down', value: '2' },
        { text: 'Round to', value: '3' }
      ],
    
      roundingDecimalPlacesList: [
        { text: '0', value: '1' },
        { text: '1', value: '2' },
        { text: '2', value: '3' },
        { text: '3', value: '4' },
        { text: '4', value: '5' }
      ]

}