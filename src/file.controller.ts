import { Controller, Body, Get, Post, Res, StreamableFile, UploadedFile, UseInterceptors, BadRequestException, Param } from "@nestjs/common";
import { createReadStream } from "fs";
import { join } from "path";
import type { Response } from 'express';
import { FileInterceptor } from "@nestjs/platform-express";
import { FormGeneratorService } from "shared/form-generator.service";
import { ApiParam, ApiBody } from "@nestjs/swagger";



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
    @Post('generate-signed-samples/:pageCount') // Use @ApiParam for path parameters
    @ApiParam({ name: 'pageCount', type: 'number' }) // Document path parameter
    // @ApiBody({ type: SampleDataConfigDTO }) // Document request body if applicable
    async generateSignedSamples(
        @Param('pageCount') pageCount: number, // Use the parameter type directly
        @UploadedFile() file: Express.Multer.File,
        @Body() sampleDataConfig: SampleDataConfigDTO,
        @Res({ passthrough: true }) res: Response
    ): Promise<any> {
        try {
            console.log(sampleDataConfig);
            // jwt token contains invalid pstID for now
            //const { pstID } = req.user;
            const pstID = '811029999999';
            const generateFilePath = await this.formGeneratorService.manualFormNonMuslimGenerator('../shared/pdf-samples/manual-form/manual_form_5.pdf', 5, 38, pageCount, 1) // 98
            const file = createReadStream(generateFilePath)


            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="signature-page.pdf"',
            });
            return new StreamableFile(file);        } catch (error) {
            throw new BadRequestException();
        }
    }
}

export interface SampleDataConfigDTO {
    pageCount: number

}