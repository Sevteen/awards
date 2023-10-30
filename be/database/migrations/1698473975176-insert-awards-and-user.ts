import { AwardItemType } from 'src/infrastructure/entities/award.entity';
import { BcryptService } from 'src/infrastructure/services/bcrypt/bcrypt.service';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertAwardsAndUser1698473975176 implements MigrationInterface {
  constructor(private readonly bcryptService: BcryptService) {
    this.bcryptService = new BcryptService();
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = [
      { email: 'user@admin.com', password: await this.bcryptService.hash('user123') },
      { email: 'ilhamhanif07@gmail.com', password: await this.bcryptService.hash('password123') }
    ];

    await queryRunner.query(`
      INSERT INTO "award" (point, name, image, type)
      VALUES
        (100000, 'Voucher KFC', 'https://images.unsplash.com/photo-1563302111-eab4b145e6c9?auto=format&fit=crop&q=80&w=3570&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '${
          AwardItemType.vouchers
        }'),
        (50000, 'Voucher MCD', 'https://images.unsplash.com/photo-1540247722900-f91e38e1f36c?auto=format&fit=crop&q=80&w=3571&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '${
          AwardItemType.vouchers
        }'),
        (3000000, 'Product Informa', 'https://st2.depositphotos.com/1003476/6686/i/450/depositphotos_66864333-stock-photo-hand-holding-spring-discount-card.jpg', '${
          AwardItemType.products
        }'),
        (150000, 'Product CleanAndClean', 'https://st3.depositphotos.com/13193658/32677/i/450/depositphotos_326770052-stock-photo-top-view-white-gift-voucher.jpg', '${
          AwardItemType.products
        }'),
        (5000000, 'giftcard Tokopedia', 'https://st3.depositphotos.com/13193658/32677/i/450/depositphotos_326770052-stock-photo-top-view-white-gift-voucher.jpg', '${
          AwardItemType.giftcard
        }'),
        (3450000, 'giftcard Shopee', 'https://st4.depositphotos.com/13324256/38336/i/450/depositphotos_383366654-stock-photo-top-view-woman-holding-gift.jpg', '${
          AwardItemType.giftcard
        }'),
        (100000, 'Voucher KFC', 'https://images.unsplash.com/photo-1563302111-eab4b145e6c9?auto=format&fit=crop&q=80&w=3570&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '${
          AwardItemType.vouchers
        }'),
        (50000, 'Voucher MCD', 'https://images.unsplash.com/photo-1540247722900-f91e38e1f36c?auto=format&fit=crop&q=80&w=3571&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', '${
          AwardItemType.vouchers
        }'),
        (3000000, 'Product Informa', 'https://st2.depositphotos.com/1003476/6686/i/450/depositphotos_66864333-stock-photo-hand-holding-spring-discount-card.jpg', '${
          AwardItemType.products
        }'),
        (150000, 'Product CleanAndClean', 'https://st3.depositphotos.com/13193658/32677/i/450/depositphotos_326770052-stock-photo-top-view-white-gift-voucher.jpg', '${
          AwardItemType.products
        }'),
        (5000000, 'giftcard Tokopedia', 'https://st3.depositphotos.com/13193658/32677/i/450/depositphotos_326770052-stock-photo-top-view-white-gift-voucher.jpg', '${
          AwardItemType.giftcard
        }'),
        (3450000, 'giftcard Shopee', 'https://st4.depositphotos.com/13324256/38336/i/450/depositphotos_383366654-stock-photo-top-view-woman-holding-gift.jpg', '${
          AwardItemType.giftcard
        }');

      INSERT INTO "user" (email, password)
      VALUES
         ${users.map((user) => `('${user.email}', '${user.password}')`)};
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "award" WHERE name IN ('Voucher KFC', 'Voucher MCD', 'Product Informa', 'Product CleanAndClean', 'giftcard Tokopedia', 'giftcard Shopee');
      DELETE FROM "user" WHERE email IN ('user@admin.con', '123@admin.com');
    `);
  }
}
