import { ApiProperty } from "@nestjs/swagger";

export class SampleDataConfigDTO {
    @ApiProperty({
        name: 'isTrustee1',
        type: 'boolean',
        required: false,
        default: true
        })
        isTrustee1: boolean


    @ApiProperty({
        name: 'isTrustee2',
        type: 'boolean',
        required: false,
        default: true
        })
        isTrustee2: boolean;

    @ApiProperty({
        name: 'isWitness',
        type: 'boolean',
        required: false,
        default: true
        })
        isWitness: boolean
      

    @ApiProperty({
        name: 'isPolicyholder',
        type: 'boolean',
        required: false,
        default: true
        })
        isPolicyholder: boolean
      

    @ApiProperty({
        name: 'pageCount',
        type: 'number',
        required: false,
        default: 100
        })
        pageCount: number


    @ApiProperty({
        name: 'scenarioNumber',
        type: 'number',
        required: false,
        default: 38
        })
        scenarioNumber: number



    @ApiProperty({
        name: 'rotationAngle',
        type: 'number',
        required: false,
        default: 0,
        description: '0 until 360 only'
        })
        rotationAngle: number
}