import { Controller, Body, Get, Post, Res, StreamableFile, UploadedFile, UseInterceptors, BadRequestException, Param, Query } from "@nestjs/common";
import { createReadStream } from "fs";
import { join } from "path";
import type { Response } from 'express';
import { FileInterceptor } from "@nestjs/platform-express";
import { FormGeneratorService } from "shared/form-generator.service";
import { ApiParam, ApiBody, ApiProperty, ApiQuery, ApiOperation } from "@nestjs/swagger";
import { SampleDataConfigDTO } from "shared/models/sample-data-config.dto";



@Controller('file')
export class FileController {
    constructor(private readonly formGeneratorService: FormGeneratorService) { }


    @Get('empty-signature-form')
    getEmptySignatureForm(@Res({ passthrough: true }) res: Response): StreamableFile {
        // const file = createReadStream(join(process.cwd(), 'shared/pdf-samples/manual-form/manual_form_10.pdf'));
        const file = createReadStream('../shared/pdf-samples/signature-page.pdf');

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="signature-page.pdf"',
        });
        return new StreamableFile(file);
    }

    @Get('empty-signature-form')
    getSignedForm(@Res({ passthrough: true }) res: Response): StreamableFile {
        // const file = createReadStream(join(process.cwd(), 'shared/pdf-samples/manual-form/manual_form_10.pdf'));
        const file = createReadStream('../shared/pdf-samples/signature-page.pdf');

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="signature-page.pdf"',
        });
        return new StreamableFile(file);
    }

    // @UseInterceptors(FileInterceptor('pdf'))
    //@UseGuards(JwtAuthGuard)
    @Post('generate-signed-samples/:pageCount/:isTrustee1/isTrustee2/:isWitness/:isPolicyholder') // Use @ApiParam for path parameters

    @ApiOperation({
        summary: 'Generate a digital form of nomination with signature',
        description: 'Generate signature. It Takes boolean as the parameter for the desired signature',
      })
    async generateSignedSamples(
        @Query() sampleDataConfig: SampleDataConfigDTO,
        @Res({ passthrough: true }) res: Response
    ): Promise<any> {
        try {
            console.log(sampleDataConfig);
            const generateFilePath = await this.formGeneratorService.signedDigitalFormGenerator(sampleDataConfig.isTrustee1, sampleDataConfig.isTrustee2, sampleDataConfig.isWitness, sampleDataConfig.isPolicyholder,sampleDataConfig.rotationAngle, sampleDataConfig.scenarioNumber, sampleDataConfig.pageCount, 1) // 98
            const file = createReadStream(generateFilePath.filePath)

            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=${generateFilePath.fileName}`,
            });
            return new StreamableFile(file);        } catch (error) {
            throw new BadRequestException();
        }
    }
}
