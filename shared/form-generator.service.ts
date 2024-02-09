
import { Injectable } from "@nestjs/common";
import { LogUtilService } from "./log-util.service";
import { PDFDocument, degrees } from "pdf-lib";
import { promises as fs } from "fs";
import { faker } from '@faker-js/faker';

@Injectable()
export class FormGeneratorService {
    constructor(
        private logger: LogUtilService
    ) {
        this.logger.setContext(FormGeneratorService.name);
    }

    /*
     * Duplicate Pages into desired counts
     */
    async pageDuplicator(pdfDoc, count) {

        const newPDFDoc = await PDFDocument.create();
        const pages = pdfDoc.getPages();
        const signaturePage = pages[0];
        for (let index = 0; index <= count - pages.length; index++) {
            // Load the existing PDF
            const [signPageCopied] = await pdfDoc.copyPages(pdfDoc, [0])

            pdfDoc.addPage(signPageCopied)

            pdfDoc.save()
        }

        return pdfDoc
    }


    async manualFormNonMuslimGenerator(
        pdfPath,
        categoryNum,
        scenarioNum,
        pageCount,
        pdfCount
    ) {
        try {
            const caseName = `manualForm-nonmuslim-scenario${scenarioNum}`;

            const isMuslim = true;
            const isDigital = false;

            const isSignatureOfTrustee1 = true;
            const isSignatureOfTrustee2 = true;
            const isSignatureOfWitness = true;
            const isSignatureOfPolicyHolder = true;
            const rotationAngle = 0;

            const outputFolder = `./shared/sample-output/non-muslim/${caseName}`;
            // const outputFolder = `\\\\filestore.maybank-my.mbb.dir\\maybank-my\\Data Strategy and Governance\\_shared with other departments\\EtiqaPlus\\shared\\${caseName}`;
            let pdfInputPath = pdfPath;

            // Check if the file exists
            await fs.access(pdfInputPath);

            // Read the existing PDF
            const existingPdfBytes = await fs.readFile(pdfInputPath);

            for (let i = 1; i <= pdfCount; i++) {
                // Load the existing PDF
                const pdfDoc = await PDFDocument.load(existingPdfBytes);
                const duplicatePageCount = pageCount
                const newPDFDoc = await this.pageDuplicator(pdfDoc, duplicatePageCount)
                const pages = newPDFDoc.getPages();

                for (let index = 0; index <= pages.length; index++) {

                    const signaturePage = pages[index];
                    // console.log('page:', index, pdfCount, 'pages:', pages.length)
                    /**
                     * signature Section
                     */
                    if (isSignatureOfTrustee1) {
                        // type 6
                        if (categoryNum === 6) {
                            await this.drawRandomSignature(signaturePage, 170, 330, 0.25)
                        } else {
                            await this.drawRandomSignature(signaturePage, 170, 570, 0.25)
                        }


                        // type 7
                        // await drawRandomSignature(signaturePage, 170, 635, 0.25)
                        // await drawRandomSignature(signaturePage, 170, 570, 0.25)
                    }

                    if (isSignatureOfTrustee2) {
                        // type 6

                        if (categoryNum === 6) {
                            await this.drawRandomSignature(signaturePage, 170, 450, 0.25)
                        } else {
                            await this.drawRandomSignature(signaturePage, 345, 570, 0.25)
                        }

                        // type 7
                        // await drawRandomSignature(signaturePage, 120, 450, 0.25)
                        // await drawRandomSignatureTrustee2(signaturePage, 130, 450, 0.25)
                        // await drawRandomSignature(signaturePage, 350, 570, 0.25)
                    }

                    if (isSignatureOfWitness) {
                        // type 6

                        if (categoryNum === 6) {
                            // await drawRandomSignature(signaturePage, 170, 450, 0.25)
                            await this.drawRandomSignature(signaturePage, 230, 300, 0.25)
                        } else {
                            // await drawRandomSignature(signaturePage, 230, 300, 0.25)

                            // type 7
                            await this.drawRandomSignature(signaturePage, 170, 490, 0.25)
                        }
                        // await drawRandomSignature(signaturePage, 170, 490, 0.25)

                    }

                    if (isSignatureOfPolicyHolder) {
                        // type 6

                        if (categoryNum === 6) {
                            await this.drawRandomSignature(signaturePage, 230, 450, 0.25)
                        } else {
                            // type 7
                            await this.drawRandomSignature(signaturePage, 345, 490, 0.25)
                        }

                    }
                    /** end of signature section */

                    /**
                     * rotation Section
                     */
                    if (rotationAngle > 0) {
                        await this.rotatePage(signaturePage, rotationAngle, pdfDoc);
                    }
                    /** end of rotation section */
                }



                /** SAVING FILE SECTION */

                // Save the modified PDF with a different name
                const outputFileName = `${caseName}-no${categoryNum}.pdf`;
                await this.createFolderIfNotExists(outputFolder);
                // createFolderIfNotExists('./shared/compressed')
                const outputPath = `${outputFolder}/${outputFileName}`;

                const modifiedPdfBytes = await pdfDoc.save();

                await fs.writeFile(outputPath, modifiedPdfBytes);
                console.log(`Generated: ${outputFileName}`)
                /** end of SAVING FILE SECTION */
            }

            const outputFileName = `${caseName}-no${categoryNum}.pdf`;
            const outputPath = `${outputFolder}/${outputFileName}`;
            //   const generatedFilePath = `${output}${outputFileName}`

            return await {
                filePath: outputPath,
                fileName: outputFileName
            }
            // await createFolderIfNotExists(`./shared/compressed/`);

            // await compressFolder(outputFolder, `./shared/compressed/${caseName}.zip`,`${caseName}.zip`);
        } catch (error) {
            console.error("Error modifying and saving PDFs:", error);
        }
    }


    async signedDigitalFormGenerator(
        isSignatureOfTrustee1,
        isSignatureOfTrustee2,
        isSignatureOfWitness,
        isSignatureOfPolicyHolder,
        rotationAngle,
        scenarioNum,
        pageCount,
        pdfCount
    ) {
        try {

            const caseName = `digitalForm-nonmuslim-scenario${scenarioNum}`;

            const outputFolder = `../shared/sample-output/non-muslim/${caseName}`;
            // const outputFolder = `\\\\filestore.maybank-my.mbb.dir\\maybank-my\\Data Strategy and Governance\\_shared with other departments\\EtiqaPlus\\shared\\${caseName}`;
            let pdfInputPath = "../shared/pdf-samples/signature-page.pdf"

            // Check if the file exists
            await fs.access(pdfInputPath);

            // Read the existing PDF
            const existingPdfBytes = await fs.readFile(pdfInputPath);
            let signatureCount = 0;

            for (let i = 1; i <= pdfCount; i++) {
                // Load the existing PDF
                const pdfDoc = await PDFDocument.load(existingPdfBytes);
                const duplicatePageCount = pageCount
                const newPDFDoc = await this.pageDuplicator(pdfDoc, duplicatePageCount)

                for (let index = 0; index < duplicatePageCount; index++) {

                    const pages = pdfDoc.getPages();
                    const signaturePage = pages[index];

                    /**
                     * signature Section
                     */
                    if (isSignatureOfTrustee1) {
                        const trustee1X = 115
                        const trustee1Y = 635
                        const trustee1Scale = 0.25
                        await this.drawRandomSignature(signaturePage, trustee1X, trustee1Y, trustee1Scale)
                    }

                    if (isSignatureOfTrustee2) {
                        const trustee2X = 370
                        const trustee2Y = 620
                        const trustee2Scale = 0.25
                        await this.drawRandomSignature(signaturePage, trustee2X, trustee2Y, trustee2Scale)
                        
                    }

                    if (isSignatureOfWitness) {

                        const witnessX = 115
                        const witnessY = 515
                        const scale = 0.25
                        await this.drawRandomSignature(signaturePage, witnessX, witnessY, scale)
                    }

                    if (isSignatureOfPolicyHolder) {
                        const policyHolderX = 370
                        const policyHolderY = 515
                        const scale = 0.25
                        await this.drawRandomSignature(signaturePage, policyHolderX, policyHolderY, scale)
                    }
                    /** end of signature section */

                    /**
                     * rotation Section
                     */
                    if (rotationAngle > 0) {
                        await this.rotatePage(signaturePage, rotationAngle, pdfDoc);
                    }
                    /** end of rotation section */
                }



                /** SAVING FILE SECTION */
                // Save the modified PDF with a different name
                const outputFileName = `${caseName}.pdf`;
                await this.createFolderIfNotExists(outputFolder);
                const outputPath = `${outputFolder}/${outputFileName}`;
                const modifiedPdfBytes = await pdfDoc.save();

                await fs.writeFile(outputPath, modifiedPdfBytes);
                console.log(`Generated: ${outputFileName}`)
                /** end of SAVING FILE SECTION */
            }

            const outputFileName = `${caseName}.pdf`;
            const outputPath = `${outputFolder}/${outputFileName}`;

            return await {
                filePath: outputPath,
                fileName: outputFileName
            }
        } catch (error) {
            console.error("Error modifying and saving PDFs:", error);
        }
    }

    async drawRandomSignature(
        signaturePage,
        coordinateX,
        coordinateY,
        scale
    ) {

        const x = isNaN(coordinateX) ? 370 : coordinateX
        const y = isNaN(coordinateY) ? 620 : coordinateY
        const scaleXY = isNaN(scale) ? 0.35 : scale
        const xRandomizer = 0
        // const xRandomizer = faker.number.int({max:30, min: -30})
        const yRandomizer = faker.number.int({ max: 10, min: 0 })
        // Add a signature image

        if (signaturePage) {

            // draw 1 stroke
            signaturePage.moveTo(x + xRandomizer, y + yRandomizer)
            signaturePage.drawSvgPath(await this.randomSvgPath(), { scale: scaleXY, borderWidth: 3 })

            // draw 2nd stroke
            signaturePage.moveTo(x + xRandomizer, y + yRandomizer)
            signaturePage.drawSvgPath(await this.randomSvgPath(), { scale: scaleXY, borderWidth: 2 })
        }

        // draw 3rd stroke
        // signaturePage.moveTo(105,535)
        // signaturePage.drawSvgPath(await randomSvgPath(), {scale: 0.45, borderWidth:3})
        return signaturePage;
    }

    async randomSvgPath() {
        const commands = ['M', 'L', 'Q', 'C'];
        let path = 'M 0,0 ';

        for (let i = 0; i < 5; i++) {  // You can adjust the number of path segments
            const command = commands[Math.floor(Math.random() * commands.length)];

            if (command === 'M' || command === 'L') {
                const x = Math.floor(Math.random() * 100);
                const y = Math.floor(Math.random() * 100);
                path += `${command} ${x},${y} `;
            } else if (command === 'Q') {
                const x1 = Math.floor(Math.random() * 100);
                const y1 = Math.floor(Math.random() * 100);
                const x = Math.floor(Math.random() * 100);
                const y = Math.floor(Math.random() * 100);
                path += `${command} ${x1},${y1} ${x},${y} `;
            } else if (command === 'C') {
                const x1 = Math.floor(Math.random() * 100);
                const y1 = Math.floor(Math.random() * 100);
                const x2 = Math.floor(Math.random() * 100);
                const y2 = Math.floor(Math.random() * 100);
                const x = Math.floor(Math.random() * 100);
                const y = Math.floor(Math.random() * 100);
                path += `${command} ${x1},${y1} ${x2},${y2} ${x},${y} `;
            }
        }

        return path;
    }

    async createFolderIfNotExists(folderPath) {
        try {
            await fs.mkdir(folderPath, { recursive: true });
            // console.log(`Folder "${folderPath}" created successfully (or already exists).`);
        } catch (error) {
            console.error(`Error creating folder "${folderPath}":`, error);
        }
    }

    async rotatePage(signaturePage, rotationAngle, pdfDoc) {

        signaturePage.setRotation(degrees(rotationAngle));

        return signaturePage
    }


    //END Service
}
