import React, { useState } from 'react';
import { Button, Descriptions, Divider, Drawer, Space, Tooltip } from 'antd';
import intl from 'react-intl-universal';
import cx from 'classnames';
import { CloseOutlined } from '@ant-design/icons';
import ExternalLinkIcon from 'components/icons/ExternalLinkIcon';
import MaleAffectedIcon from 'components/icons/MaleAffectedIcon';
import MaleNotAffectedIcon from 'components/icons/MaleNotAffectedIcon';
import FemaleAffectedIcon from 'components/icons/FemaleAffectedIcon';
import FemaleNotAffectedIcon from 'components/icons/FemaleNotAffectedIcon';
import { getTopBodyElement } from 'utils/helper';
import { DonorsEntity, VariantEntity } from 'store/graphql/variants/models';
import { DISPLAY_WHEN_EMPTY_DATUM } from 'views/screens/variant/constants';
import { ArrangerEdge } from 'store/graphql/models';
import IGVModal from 'views/screens/variant/OccurenceDrawer/IGVModal';
import { removeUnderscoreAndCapitalize } from '@ferlab/ui/core/utils/stringUtils';

import style from './index.module.scss';
import { useRpt } from 'hooks/rpt';
import ReportDownloadButton from './ReportDownloadButton';
import capitalize from 'lodash/capitalize';

interface OwnProps {
  patientId: string;
  data: VariantEntity;
  opened?: boolean;
  toggle: (opened: boolean) => void;
}

const getDonor = (patientId: string, data: VariantEntity) => {
  const donors: ArrangerEdge<DonorsEntity>[] = data?.donors?.hits?.edges || [];
  const donor: ArrangerEdge<DonorsEntity> | undefined = donors.find(
    (donor) => donor.node.patient_id === patientId,
  );
  return donor?.node;
};

const getParentTitle = (who: 'mother' | 'father', id: string, affected: boolean) => {
  let AffectedIcon = null;

  if (affected) {
    AffectedIcon = who === 'mother' ? FemaleAffectedIcon : MaleAffectedIcon;
  } else {
    AffectedIcon = who === 'mother' ? FemaleNotAffectedIcon : MaleNotAffectedIcon;
  }

  return (
    <span className={cx(style.parentStatusTitle, 'parentStatusTitle')}>
      {`${intl.get(`screen.patientvariant.drawer.${who}.genotype`)} ${id ? `(${id})` : ''}`}
      {affected !== null ? (
        <Tooltip
          placement="right"
          title={
            affected
              ? intl.get('screen.patientvariant.drawer.affected')
              : intl.get('screen.patientvariant.drawer.notaffected')
          }
        >
          <span className={cx(style.parentStatusIconWrapper, 'parentStatusIconWrapper')}>
            <AffectedIcon className={cx(style.parentStatusIcon, 'parentStatusIcon')} />
          </span>
        </Tooltip>
      ) : undefined}
    </span>
  );
};

const OccurenceDrawer = ({ patientId, data, opened = false, toggle }: OwnProps) => {
  const [modalOpened, toggleModal] = useState(false);
  const { loading: loadingRpt, rpt } = useRpt();

  const donor = getDonor(patientId, data);

  const hasAParent = donor?.father_id || donor?.mother_id;

  const variantId = data?.hgvsg;

  return (
    <>
      <Drawer
        title={<Tooltip title={variantId}>Occurrence</Tooltip>}
        placement="right"
        onClose={() => toggle(!opened)}
        visible={opened}
        closeIcon={<CloseOutlined size={16} />}
        width={500}
        className={cx(style.occurenceDrawer, 'occurenceDrawer')}
        getContainer={() => getTopBodyElement()}
      >
        <Space size={24} direction="vertical">
          <Descriptions column={1} className={cx(style.description, 'description')}>
            <Descriptions.Item label={'Variant'}>
              {variantId || DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item label={'Patient'}>
              {patientId || DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions
            column={1}
            className={cx(style.description, 'description')}
            title={capitalize(intl.get('zygosity'))}
          >
            <Descriptions.Item label={capitalize(intl.get('zygosity'))}>
              {donor?.zygosity || DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item
              label={capitalize(intl.get('compound.heterozygous.abbrev', { num: 0 }))}
            >
              {DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item
              label={capitalize(intl.get('potential.compound.heterozygous.abbrev', { num: 0 }))}
            >
              {DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
          </Descriptions>
          {hasAParent && (
            <Descriptions
              title={capitalize(intl.get('family'))}
              column={1}
              className={cx(style.description, 'description')}
            >
              {donor?.mother_id && (
                <Descriptions.Item
                  label={getParentTitle(
                    'mother',
                    donor?.mother_id!,
                    donor?.mother_affected_status!,
                  )}
                >
                  {donor?.mother_calls ? donor?.mother_calls.join('/') : DISPLAY_WHEN_EMPTY_DATUM}
                </Descriptions.Item>
              )}
              {donor?.father_id && (
                <Descriptions.Item
                  label={getParentTitle(
                    'father',
                    donor?.father_id!,
                    donor?.father_affected_status!,
                  )}
                >
                  {donor?.father_calls ? donor?.father_calls.join('/') : DISPLAY_WHEN_EMPTY_DATUM}
                </Descriptions.Item>
              )}
              <Descriptions.Item label={intl.get('screen.patientvariant.drawer.transmission')}>
                {removeUnderscoreAndCapitalize(donor?.transmission! || '').defaultMessage(
                  DISPLAY_WHEN_EMPTY_DATUM,
                )}
              </Descriptions.Item>
              <Descriptions.Item label={intl.get('screen.patientvariant.drawer.parental.origin')}>
                {donor?.parental_origin
                  ? capitalize(intl.get(donor?.parental_origin))
                  : DISPLAY_WHEN_EMPTY_DATUM}
              </Descriptions.Item>
            </Descriptions>
          )}
          <Descriptions
            title={intl.get('screen.patientvariant.drawer.seq.method')}
            column={1}
            className={cx(style.description, 'description')}
          >
            <Descriptions.Item label={intl.get('screen.patientvariant.drawer.depth.quality')}>
              {donor?.qd || DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item label={intl.get('screen.patientvariant.drawer.allprof')}>
              {donor?.ad_alt || DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item label={intl.get('screen.patientvariant.drawer.alltotal')}>
              {donor?.ad_total || DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item label={intl.get('screen.patientvariant.drawer.allratio')}>
              {donor?.ad_ratio ? donor?.ad_ratio.toFixed(2) : DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item label={intl.get('screen.patientvariant.drawer.gq')}>
              {donor?.gq ? donor.gq : DISPLAY_WHEN_EMPTY_DATUM}
            </Descriptions.Item>
            <Descriptions.Item label={intl.get('screen.patientvariant.drawer.filter')}>
              {donor?.filters}
            </Descriptions.Item>
          </Descriptions>
          <Divider style={{ margin: 0 }} />
          <Space>
            <Button
              loading={loadingRpt}
              disabled={loadingRpt || !rpt}
              type="primary"
              onClick={() => toggleModal(true)}
            >
              {intl.get('screen.patientvariant.drawer.igv.viewer')}
              <ExternalLinkIcon height="14" width="14" className="anticon" />
            </Button>
            <ReportDownloadButton rpt={rpt} patientId={patientId} variantId={variantId} />
          </Space>
        </Space>
      </Drawer>
      {donor && (
        <IGVModal
          rpt={rpt}
          donor={donor}
          variantEntity={data}
          isOpen={modalOpened}
          toggleModal={toggleModal}
        />
      )}
    </>
  );
};

export default OccurenceDrawer;
